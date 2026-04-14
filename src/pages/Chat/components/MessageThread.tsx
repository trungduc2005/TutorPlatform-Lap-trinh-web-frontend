import type { ChangeEvent, FormEvent, RefObject } from "react";
import {
  formatMessageTime,
  formatRole,
  getInitial,
} from "../../../features/chat/lib/chatUtils";
import type {
  ChatMessageResponse,
  ConversationResponse,
} from "../../../features/chat/model/chatTypes";

interface MessageThreadProps {
  userId?: number;
  targetName: string;
  activeConversation: ConversationResponse | null;
  messages: ChatMessageResponse[];
  messageText: string;
  loading: boolean;
  sending: boolean;
  bottomRef: RefObject<HTMLDivElement | null>;
  onMessageChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function MessageThread({
  userId,
  targetName,
  activeConversation,
  messages,
  messageText,
  loading,
  sending,
  bottomRef,
  onMessageChange,
  onSubmit,
}: MessageThreadProps) {
  if (!activeConversation) {
    return (
      <div className="chat-thread">
        <div className="chat-thread__empty">
          <h3>Chưa chọn cuộc trò chuyện</h3>
          <p>
            {targetName
              ? `Đang chuẩn bị mở chat với ${targetName}.`
              : "Hãy chọn một hội thoại ở cột bên trái hoặc mở chat từ trang khác."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-thread">
      <header className="chat-thread__header">
        <div className="chat-thread__contact">
          {activeConversation.otherAvatarUrl ? (
            <img
              className="chat-thread__avatar chat-thread__avatar--image"
              src={activeConversation.otherAvatarUrl}
              alt={activeConversation.otherFullName}
            />
          ) : (
            <span className="chat-thread__avatar">
              {getInitial(activeConversation.otherFullName)}
            </span>
          )}

          <div>
            <h2>{activeConversation.otherFullName}</h2>
            <p>{formatRole(activeConversation.otherRole)}</p>
          </div>
        </div>
      </header>

      <div className="chat-thread__body">
        {loading ? (
          <div className="chat-thread__state">Đang tải tin nhắn...</div>
        ) : messages.length === 0 ? (
          <div className="chat-thread__state">
            Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.
          </div>
        ) : (
          messages.map((message) => {
            const isMine = message.senderId === userId;
            const messageTime = formatMessageTime(message.createdAt);

            return (
              <div
                key={message.id}
                className={`chat-message${isMine ? " chat-message--me" : ""}`}
              >
                <div
                  className={`chat-message__bubble${isMine ? " chat-message__bubble--me" : ""}`}
                  title={messageTime ?? undefined}
                >
                  <p>{message.content}</p>
                  {messageTime ? <span className="chat-message__time">{messageTime}</span> : null}
                </div>
              </div>
            );
          })
        )}

        <div ref={bottomRef} />
      </div>

      <form className="chat-compose" onSubmit={onSubmit}>
        <textarea
          value={messageText}
          onChange={onMessageChange}
          placeholder={`Nhắn cho ${activeConversation.otherFullName}...`}
          rows={1}
          maxLength={2000}
        />

        <button type="submit" disabled={sending || !messageText.trim()}>
          {sending ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
  );
}

export default MessageThread;
