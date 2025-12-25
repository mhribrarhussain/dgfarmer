export interface Message {
    id: number;
    orderId: number;
    senderId: number;
    senderName: string;
    senderRole: string;
    content: string;
    createdAt: string;
}

export interface SendMessage {
    content: string;
}
