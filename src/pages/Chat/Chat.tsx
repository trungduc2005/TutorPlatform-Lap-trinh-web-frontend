import { useChat } from "../../features/chat/hooks/useChat";
import ConversationList from "./components/ConversationList";
import MessageThread from "./components/MessageThread";
import "./Chat.css";

function Chat() {
    const {
        status,
        user,
        targetName,
        conversationCount,
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
    } = useChat();

    if (status === "CHECKING") {
        return (
            <section className="chat-page">
                <div className="chat-page__container">
                    <div className="chat-layout chat-layout--loading">
                        <div className="chat-thread__state">Đang kiểm tra đăng nhập...</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="chat-page">
            <div className="chat-page__container">

                {error ? <div className="chat-alert">{error}</div> : null}

                <div className="chat-layout">
                    <ConversationList
                        conversations={filteredConversations}
                        totalCount={conversationCount}
                        activeConversationId={activeConversation?.id ?? null}
                        loading={loadingConversations}
                        searchText={searchText}
                        onSearchChange={handleSearchChange}
                        onSelectConversation={handleSelectConversation}
                    />

                    <MessageThread
                        userId={user?.id}
                        targetName={targetName}
                        activeConversation={activeConversation}
                        messages={messages}
                        messageText={messageText}
                        loading={loadingMessages}
                        sending={sending}
                        bottomRef={bottomRef}
                        onMessageChange={handleMessageChange}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </section>
    );
}

export default Chat;
