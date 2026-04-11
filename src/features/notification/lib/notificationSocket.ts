import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { env } from "../../../shared/lib/env";

export function connectNotificationSocket(token: string, onNotify: () => void) {
    const client = new Client({
        webSocketFactory: () => new SockJS(env.wsUrl),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe("/user/queue/notifications", () => onNotify());
        },
    });

    client.activate();
    return () => { void client.deactivate(); };
}
