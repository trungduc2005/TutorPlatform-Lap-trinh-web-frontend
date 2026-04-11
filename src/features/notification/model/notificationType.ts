export interface NotificationType {
    id: number;
    type: string | null;
    title: string;
    body: string;
    read: boolean;
    senderId: number | null;
    senderName: string;
    recipientId: number | null;
    classApplicationId: number | null;
    createdAt: string;
}
