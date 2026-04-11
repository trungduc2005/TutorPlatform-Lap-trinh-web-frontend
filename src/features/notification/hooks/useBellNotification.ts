import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../app/store/hooks";
import type { NotificationType } from "../model/notificationType";
import { notificationApi } from "../api/notificationApi";
import { connectNotificationSocket } from "../lib/notificationSocket";

const NOTIFICATION_LIMIT = 8;

export function useBellNotification(isDropdownOpen: boolean) {
    const { status, token } = useAppSelector((state) => state.auth);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [hasNew, setHasNew] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const isDropdownOpenRef = useRef(isDropdownOpen);

    useEffect(() => {
        isDropdownOpenRef.current = isDropdownOpen;
    }, [isDropdownOpen]);

    useEffect(() => {
        if (status !== "AUTHENTICATED") {
            setNotifications([]);
            setHasNew(false);
            setIsLoading(false);
            return;
        }

        let ignore = false;

        void notificationApi
            .hasNew()
            .then((value) => {
                if (!ignore) {
                    setHasNew(value);
                }
            })
            .catch(() => undefined);

        return () => {
            ignore = true;
        };
    }, [status, token]);

    const fetchNotifications = async (showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const items = await notificationApi.getMine();
            const latestItems = items.slice(0, NOTIFICATION_LIMIT);
            setNotifications(latestItems);
            setHasNew(items.some((item) => !item.read));
            return latestItems;
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    };

    const markAllAsRead = async () => {
        await notificationApi.readAll();
        setHasNew(false);
        setNotifications((current) =>
            current.map((item) => ({
                ...item,
                read: true,
            }))
        );
    };

    const openDropdown = async () => {
        const items = await fetchNotifications(true);

        if (items.some((item) => !item.read)) {
            await markAllAsRead();
        }
    };

    useEffect(() => {
        if (status !== "AUTHENTICATED" || !token) {
            return;
        }

        return connectNotificationSocket(token, () => {
            if (!isDropdownOpenRef.current) {
                setHasNew(true);
                return;
            }

            void fetchNotifications(false)
                .then((items) => {
                    if (items.some((item) => !item.read)) {
                        void markAllAsRead();
                    }
                })
                .catch(() => undefined);
        });
    }, [status, token]);

    return {
        notifications,
        hasNew,
        isLoading,
        openDropdown,
    };
}
