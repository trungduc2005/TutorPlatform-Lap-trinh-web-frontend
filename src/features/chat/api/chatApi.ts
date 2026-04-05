import axiosClient from "../../../shared/api/axiosClient";
import type {
    ChatMessageResponse,
    ConversationResponse,
} from "../model/chatTypes";

export const chatApi = {
    async getOrCreateDirectConversation(otherUserId: number) {
        const { data } = await axiosClient.post<ConversationResponse>(
            `/chat/conversations/direct/${otherUserId}`
        );

        return data;
    },

    async getMyConversations() {
        const { data } = await axiosClient.get<ConversationResponse[]>(
            "/chat/conversations"
        );

        return data;
    },

    async getConversationMessages(conversationId: number) {
        const { data } = await axiosClient.get<ChatMessageResponse[]>(
            `/chat/conversations/${conversationId}/messages`
        );

        return data;
    },

    async sendChatMessage(conversationId: number, content: string) {
        const { data } = await axiosClient.post<ChatMessageResponse>(
            `/chat/conversations/${conversationId}/messages`,
            { content }
        );

        return data;
    },

    async markConversationAsRead(conversationId: number) {
        await axiosClient.put(`/chat/conversations/${conversationId}/read`);
    },
};
