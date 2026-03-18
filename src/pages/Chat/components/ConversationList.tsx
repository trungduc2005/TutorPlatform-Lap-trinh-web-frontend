import type { ChangeEvent } from "react";
import { FiSearch } from "react-icons/fi";
import {
    getInitial,
} from "../../../features/chat/lib/chatUtils";
import type { ConversationResponse } from "../../../features/chat/model/chatTypes";

interface ConversationListProps {
    conversations: ConversationResponse[];
    totalCount: number;
    activeConversationId: number | null;
    loading: boolean;
    searchText: string;
    onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSelectConversation: (conversationId: number) => void;
}

function ConversationList({
    conversations,
    totalCount,
    activeConversationId,
    loading,
    searchText,
    onSearchChange,
    onSelectConversation,
}: ConversationListProps) {
    return (
        <aside className="chat-sidebar">
            <div className="chat-sidebar__header">
                <div>
                    <h2>Hội thoại</h2>
                </div>
            </div>

            <div className="chat-sidebar__searchBox">
                <FiSearch className="chat-sidebar__searchIcon" aria-hidden="true" />
                <input
                    className="chat-sidebar__search"
                    type="text"
                    placeholder="Tìm theo tên hoặc nội dung..."
                    value={searchText}
                    onChange={onSearchChange}
                />
            </div>

            <div className="chat-sidebar__list">
                {loading ? (
                    <div className="chat-sidebar__state">
                        Đang tải danh sách hội thoại...
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="chat-sidebar__state">
                        {totalCount === 0
                            ? "Bạn chưa có cuộc trò chuyện nào."
                            : "Không tìm thấy hội thoại phù hợp."}
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            type="button"
                            className={`conversation-card${
                                conversation.id === activeConversationId
                                    ? " conversation-card--active"
                                    : ""
                            }`}
                            onClick={() => onSelectConversation(conversation.id)}
                        >
                            {conversation.otherAvatarUrl ? (
                                <img
                                    className="conversation-card__avatar conversation-card__avatar--image"
                                    src={conversation.otherAvatarUrl}
                                    alt={conversation.otherFullName}
                                />
                            ) : (
                                <span className="conversation-card__avatar">
                                    {getInitial(conversation.otherFullName)}
                                </span>
                            )}

                            <div className="conversation-card__content">
                                <div className="conversation-card__row">
                                    <strong>{conversation.otherFullName}</strong>
                                </div>

                                <p
                                    className={`conversation-card__preview${
                                        conversation.unreadCount > 0
                                            ? " conversation-card__preview--unread"
                                            : ""
                                    }`}
                                >
                                    {conversation.lastMessage ??
                                        `Bắt đầu nhắn tin với ${conversation.otherFullName}`}
                                </p>
                            </div>

                            {conversation.unreadCount > 0 ? (
                                <span
                                    className="conversation-card__badge"
                                    aria-label={`${conversation.unreadCount} tin nhắn chưa đọc`}
                                    title={`${conversation.unreadCount} tin nhắn chưa đọc`}
                                />
                            ) : null}
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
}

export default ConversationList;
