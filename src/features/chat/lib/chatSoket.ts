import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { ChatMessageResponse } from "../model/chatTypes";
import { env } from "../../../shared/lib/env";

const WS_URL = env.wsUrl;

export function connectChatSocket(
    token: string,
    onMessage: (message: ChatMessageResponse) => void,
) {
    const client = new Client({
        webSocketFactory: () => new SockJS(WS_URL),
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe("/user/queue/messages", (frame) => {
                onMessage(JSON.parse(frame.body) as ChatMessageResponse);
            });
        },
    });

    client.activate();

    return () => {
        void client.deactivate();
    };
}
