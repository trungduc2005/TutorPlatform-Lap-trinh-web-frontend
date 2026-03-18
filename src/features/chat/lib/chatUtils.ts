import type {
    ChatMessageResponse,
    ConversationResponse,
} from "../model/chatTypes";

export function normalizeText(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export function getChatErrorMessage(error: unknown) {
    if (error instanceof Error && error.message.trim()) {
        return error.message;
    }

    return "Khong the tai du lieu chat luc nay.";
}

function parseChatDate(value?: string | null) {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toTimestamp(value?: string | null) {
    return parseChatDate(value)?.getTime() ?? 0;
}

export function sortConversations(items: ConversationResponse[]) {
    return [...items].sort((a, b) => {
        const diff = toTimestamp(b.lastMessageAt) - toTimestamp(a.lastMessageAt);
        return diff !== 0 ? diff : b.id - a.id;
    });
}

export function sortMessages(items: ChatMessageResponse[]) {
    return [...items].sort(
        (a, b) => toTimestamp(a.createdAt) - toTimestamp(b.createdAt)
    );
}

export function upsertConversation(
    items: ConversationResponse[],
    conversation: ConversationResponse
) {
    const exists = items.some((item) => item.id === conversation.id);

    const next = exists
        ? items.map((item) =>
              item.id === conversation.id ? { ...item, ...conversation } : item
          )
        : [conversation, ...items];

    return sortConversations(next);
}

export function upsertMessage(
    items: ChatMessageResponse[],
    message: ChatMessageResponse
) {
    const exists = items.some((item) => item.id === message.id);

    const next = exists
        ? items.map((item) =>
              item.id === message.id ? { ...item, ...message } : item
          )
        : [...items, message];

    return sortMessages(next);
}

export function filterConversations(
    items: ConversationResponse[],
    keyword: string
) {
    const normalizedKeyword = normalizeText(keyword.trim());

    if (!normalizedKeyword) {
        return items;
    }

    return items.filter((item) => {
        const haystack = normalizeText(
            `${item.otherFullName} ${item.otherRole} ${item.lastMessage ?? ""}`
        );

        return haystack.includes(normalizedKeyword);
    });
}

export function formatRole(role: string) {
    if (role === "TUTOR") return "Gia su";
    if (role === "HIRER") return "Phu huynh";
    if (role === "ADMIN") return "Quan tri";
    return role;
}

export function formatConversationTime(value?: string | null) {
    const date = parseChatDate(value);

    if (!date) {
        return "Moi tao";
    }

    const today = new Date();
    const isSameDay = date.toDateString() === today.toDateString();

    return new Intl.DateTimeFormat("vi-VN", {
        day: isSameDay ? undefined : "2-digit",
        month: isSameDay ? undefined : "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatMessageTime(value: string) {
    const date = parseChatDate(value);

    if (!date) {
        return null;
    }

    return new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function getInitial(name: string) {
    return name.trim().charAt(0).toUpperCase() || "U";
}
