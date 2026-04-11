import { useEffect, useState } from "react";
import { useAppSelector } from "../../../app/store/hooks";
import { notificationApi } from "../api/notificationApi";
import { connectNotificationSocket } from "../lib/notificationSocket";

export function useBellNotification() {
    const { status, token } = useAppSelector((state) => state.auth);
    const [hasNew, setHasNew] = useState(false);

    useEffect(() => {
        if (status !== "AUTHENTICATED") {
            setHasNew(false);
            return;
        }

        let ignore = false;
        void notificationApi.hasNew().then((value) => {
            if (!ignore) setHasNew(value);
        }).catch(() => undefined);

        return () => { ignore = true; };
    }, [status]);

    useEffect(() => {
        if (status !== "AUTHENTICATED" || !token) {
            return;
        }

        return connectNotificationSocket(token, () => setHasNew(true));
    }, [status, token]);

    const markAllAsRead = async () => {
        await notificationApi.readAll();
        setHasNew(false);
    };

    return { hasNew, markAllAsRead };
}
