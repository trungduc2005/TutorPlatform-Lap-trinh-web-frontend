export interface ConversationResponse {
    id: number;
    otherUserId: number;
    otherFullName: string;
    otherAvatarUrl?: string | null;
    otherRole: string;
    lastMessage?: string | null;
    lastMessageAt?: string | null;
    unreadCount: number;
}

export interface ChatMessageResponse {
    id: number;
    conversationId: number;
    senderId: number;
    senderName: string;
    content: string;
    read: boolean;
    createdAt: string;
}
