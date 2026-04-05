import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../app/store/hooks";
import { chatApi } from "../api/chatApi";
import { connectChatSocket } from "../lib/chatSoket";
import {
    filterConversations,
    getChatErrorMessage,
    sortConversations,
    sortMessages,
    upsertConversation,
    upsertMessage,
} from "../lib/chatUtils";
import type {
    ChatMessageResponse,
    ConversationResponse,
} from "../model/chatTypes";

export function useChat() {
    const { status, token, user } = useAppSelector((state) => state.auth);
    const [searchParams] = useSearchParams();

    const targetUserId = Number(searchParams.get("userId") ?? "");
    const targetName = searchParams.get("name") ?? "";

    const [conversations, setConversations] = useState<ConversationResponse[]>([]);
    const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
    const [searchText, setSearchText] = useState("");
    const [messageText, setMessageText] = useState("");
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");

    const activeConversationIdRef = useRef<number | null>(null);
    const currentUserIdRef = useRef<number | null>(user?.id ?? null);
    const openedTargetRef = useRef<number | null>(null);
    const conversationsRef = useRef<ConversationResponse[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        activeConversationIdRef.current = activeConversationId;
    }, [activeConversationId]);

    useEffect(() => {
        currentUserIdRef.current = user?.id ?? null;
    }, [user?.id]);

    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    useEffect(() => {
        if (status !== "AUTHENTICATED") {
            return;
        }

        let ignore = false;

        const loadConversations = async () => {
            setLoadingConversations(true);
            setError("");

            try {
                const data = await chatApi.getMyConversations();

                if (ignore) {
                    return;
                }

                const sorted = sortConversations(data);
                setConversations(sorted);

                setActiveConversationId((prev) => {
                    if (prev && sorted.some((item) => item.id === prev)) {
                        return prev;
                    }

                    return sorted[0]?.id ?? null;
                });
            } catch (error) {
                if (!ignore) {
                    setError(getChatErrorMessage(error));
                }
            } finally {
                if (!ignore) {
                    setLoadingConversations(false);
                }
            }
        };

        void loadConversations();

        return () => {
            ignore = true;
        };
    }, [status]);

    useEffect(() => {
        if (status !== "AUTHENTICATED") {
            return;
        }

        if (!Number.isFinite(targetUserId) || targetUserId <= 0) {
            openedTargetRef.current = null;
            return;
        }

        if (targetUserId === user?.id) {
            return;
        }

        if (openedTargetRef.current === targetUserId) {
            return;
        }

        let ignore = false;

        const openDirectConversation = async () => {
            try {
                const conversation = await chatApi.getOrCreateDirectConversation(targetUserId);

                if (ignore) {
                    return;
                }

                openedTargetRef.current = targetUserId;
                setConversations((prev) => upsertConversation(prev, conversation));
                setActiveConversationId(conversation.id);
            } catch (error) {
                if (!ignore) {
                    setError(getChatErrorMessage(error));
                }
            }
        };

        void openDirectConversation();

        return () => {
            ignore = true;
        };
    }, [status, targetUserId, user?.id]);

    useEffect(() => {
        if (status !== "AUTHENTICATED" || !activeConversationId) {
            setMessages([]);
            return;
        }

        let ignore = false;

        const loadMessages = async () => {
            setLoadingMessages(true);
            setError("");

            try {
                const data = await chatApi.getConversationMessages(activeConversationId);

                if (ignore) {
                    return;
                }

                setMessages(sortMessages(data));
                setConversations((prev) =>
                    prev.map((item) =>
                        item.id === activeConversationId
                            ? { ...item, unreadCount: 0 }
                            : item
                    )
                );

                void chatApi.markConversationAsRead(activeConversationId).catch(() => undefined);
            } catch (error) {
                if (!ignore) {
                    setError(getChatErrorMessage(error));
                }
            } finally {
                if (!ignore) {
                    setLoadingMessages(false);
                }
            }
        };

        void loadMessages();

        return () => {
            ignore = true;
        };
    }, [activeConversationId, status]);

    useEffect(() => {
        if (status !== "AUTHENTICATED" || !token) {
            return;
        }

        const disconnect = connectChatSocket(token, (incomingMessage) => {
            const isActiveThread =
                activeConversationIdRef.current === incomingMessage.conversationId;
            const isOwnMessage =
                incomingMessage.senderId === currentUserIdRef.current;
            const conversationExists = conversationsRef.current.some(
                (item) => item.id === incomingMessage.conversationId
            );

            if (!conversationExists) {
                void chatApi
                    .getMyConversations()
                    .then((data: ConversationResponse[]) => {
                        setConversations(sortConversations(data));
                    })
                    .catch(() => undefined);
            }

            setConversations((prev) => {
                if (!prev.some((item) => item.id === incomingMessage.conversationId)) {
                    return prev;
                }

                const next = prev.map((item) =>
                    item.id === incomingMessage.conversationId
                        ? {
                              ...item,
                              lastMessage: incomingMessage.content,
                              lastMessageAt: incomingMessage.createdAt,
                              unreadCount:
                                  isActiveThread || isOwnMessage
                                      ? 0
                                      : item.unreadCount + 1,
                          }
                        : item
                );

                return sortConversations(next);
            });

            if (isActiveThread) {
                setMessages((prev) => upsertMessage(prev, incomingMessage));

                if (!isOwnMessage) {
                    void chatApi
                        .markConversationAsRead(incomingMessage.conversationId)
                        .catch(() => undefined);
                }
            }
        });

        return () => {
            disconnect();
        };
    }, [status, token]);

    useEffect(() => {
        if (messages.length === 0) {
            return;
        }

        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        });
    }, [messages, activeConversationId]);

    const activeConversation =
        conversations.find((item) => item.id === activeConversationId) ?? null;

    const filteredConversations = filterConversations(conversations, searchText);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleMessageChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessageText(event.target.value);
    };

    const handleSelectConversation = (conversationId: number) => {
        setActiveConversationId(conversationId);
        setConversations((prev) =>
            prev.map((item) =>
                item.id === conversationId ? { ...item, unreadCount: 0 } : item
            )
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const content = messageText.trim();

        if (!content || !activeConversationId) {
            return;
        }

        setSending(true);
        setError("");

        try {
            const sentMessage = await chatApi.sendChatMessage(activeConversationId, content);

            setMessageText("");
            setMessages((prev) => upsertMessage(prev, sentMessage));
            setConversations((prev) =>
                sortConversations(
                    prev.map((item) =>
                        item.id === activeConversationId
                            ? {
                                  ...item,
                                  lastMessage: sentMessage.content,
                                  lastMessageAt: sentMessage.createdAt,
                                  unreadCount: 0,
                              }
                            : item
                    )
                )
            );
        } catch (error) {
            setError(getChatErrorMessage(error));
        } finally {
            setSending(false);
        }
    };

    return {
        status,
        user,
        targetName,
        conversationCount: conversations.length,
        filteredConversations,
        activeConversation,
        messages,
        searchText,
        messageText,
        loadingConversations,   
        loadingMessages,
        sending,
        error,
        bottomRef,
        handleSearchChange,
        handleMessageChange,
        handleSelectConversation,
        handleSubmit,
    };
}
