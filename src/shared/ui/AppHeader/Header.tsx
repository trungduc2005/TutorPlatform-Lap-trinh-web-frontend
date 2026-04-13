import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { message, Modal } from "antd";
import { FiBell } from "react-icons/fi";
import type { NotificationType } from "../../../features/notification/model/notificationType";
import { useBellNotification } from "../../../features/notification/hooks/useBellNotification";
import kittyLogo from "../../../assets/hello-kitty-logo.svg";
import { useAppSelector } from "../../../app/store/hooks";
import "./Header.css";

interface NavItem {
    path: string;
    label: string;
}

const NAV_ITEMS_COMMON: NavItem[] = [
    { path: "/", label: "Trang chủ" },
    { path: "/contract", label: "Hợp đồng"},
];

const NAV_ITEMS_GUEST: NavItem[] = [
    ...NAV_ITEMS_COMMON,
    { path: "/classes", label: "Danh sách lớp mới" },
    { path: "/featured-tutors", label: "Gia sư tiêu biểu" },
];

const NAV_ITEMS_TUTOR: NavItem[] = [
    ...NAV_ITEMS_COMMON,
    { path: "/classes", label: "Danh sách lớp mới" },
    { path: "/chat", label: "Tin nhắn" },
    { path: "/classroom-calling", label: "Phòng học Online"},
    { path: "/tutor/class-applications", label: "Lớp đã nhận"}
];

const NAV_ITEMS_HIRER: NavItem[] = [
    { path: "/", label: "Trang chủ" },
    { path: "/hire-tutor", label: "Thuê gia sư" },
    { path: "/featured-tutors", label: "Gia sư tiêu biểu" },
    { path: "/hirer/class-management", label: "Quản lý lớp học" },
    { path: "/hirer/application-management", label: "Quản lý ứng tuyển" },
    { path: "/contract", label: "Hợp đồng" },
    { path: "/chat", label: "Tin nhắn" },
    { path: "/classroom-calling", label: "Phòng học Online" },
];

function formatNotificationDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}


function GuestTopActions() {
    return (
        <>
            <Link to="/register">
                <button className="top-btn top-btn--light">Đăng ký</button>
            </Link>
            <Link to="/login">
                <button className="top-btn top-btn--pale">Đăng nhập</button>
            </Link>
            <Link to="/contact" className="phone">
                <span className="phone-icon">📞</span>
                <span className="phone-number">0123456789</span>
            </Link>
        </>
    );
}



function UserTopActions() {
    const user = useAppSelector((state) => state.auth.user);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<NotificationType | null>(null);
    const notificationRef = useRef<HTMLDivElement | null>(null);
    const { notifications, hasNew, isLoading, openDropdown } = useBellNotification(isNotificationOpen);
    const initial = user?.avatarUrl?.trim() || "T";

    useEffect(() => {
        if (!isNotificationOpen || selectedNotification) {
            return;
        }

        const handleMouseDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (!notificationRef.current?.contains(target)) {
                setIsNotificationOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isNotificationOpen, selectedNotification]);

    const handleNotificationButtonClick = () => {
        if (isNotificationOpen) {
            setSelectedNotification(null);
            setIsNotificationOpen(false);
            return;
        }

        setIsNotificationOpen(true);
        void openDropdown().catch((error) => {
            message.error(error instanceof Error ? error.message : "Không thể tải thông báo");
        });
    };

    return (
        <>
            <div className="notification-wrapper" ref={notificationRef}>
                <button
                    type="button"
                    className="notification"
                    aria-label="Thông báo"
                    aria-expanded={isNotificationOpen}
                    aria-haspopup="dialog"
                    onClick={handleNotificationButtonClick}
                >
                    <span className="notification__icon" aria-hidden="true">
                        <FiBell />
                    </span>
                    {hasNew ? <span className="notification__dot" aria-hidden="true" /> : null}
                </button>

                {isNotificationOpen ? (
                    <div className="notification-dropdown" role="dialog" aria-label="Danh sách thông báo">
                        <div className="notification-dropdown__header">
                            <p className="notification-dropdown__title">Thông báo</p>
                            <span className="notification-dropdown__subtitle">8 thông báo gần nhất</span>
                        </div>

                        <div className="notification-dropdown__content">
                            {isLoading ? (
                                <p className="notification-dropdown__state">Đang tải thông báo...</p>
                            ) : notifications.length === 0 ? (
                                <p className="notification-dropdown__state">Bạn chưa có thông báo nào.</p>
                            ) : (
                                <ul className="notification-list">
                                    {notifications.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                type="button"
                                                className={`notification-list__item${
                                                    item.read ? "" : " notification-list__item--unread"
                                                }`}
                                                onClick={() => setSelectedNotification(item)}
                                            >
                                                <div className="notification-list__top">
                                                    <span className="notification-list__title">{item.title}</span>
                                                    <span className="notification-list__time">
                                                        {formatNotificationDate(item.createdAt)}
                                                    </span>
                                                </div>
                                                <span className="notification-list__sender">{item.senderName}</span>
                                                <p className="notification-list__body">{item.body}</p>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            <Modal
                title={selectedNotification?.title ?? "Chi tiết thông báo"}
                open={selectedNotification !== null}
                onCancel={() => setSelectedNotification(null)}
                footer={null}
                destroyOnClose
                centered
            >
                {selectedNotification ? (
                    <div className="notification-detail">
                        <div className="notification-detail__meta">
                            <span>Từ: {selectedNotification.senderName}</span>
                            <span>{formatNotificationDate(selectedNotification.createdAt)}</span>
                        </div>

                        <p className="notification-detail__body">{selectedNotification.body}</p>
                    </div>
                ) : null}
            </Modal>

            <Link to="/profile" className="top-action-link">
                <button type="button" className="profile">
                    <img src={initial} alt="" className="profile__avatar" />
                    <span className="profile__name">{user?.fullName ?? "Tài khoản"}</span>
                </button>
            </Link>
        </>
    );
}



function Header() {
    const { status, user } = useAppSelector((state) => state.auth);

    const navItems =
        user?.role === "TUTOR"
            ? NAV_ITEMS_TUTOR
            : user?.role === "HIRER"
                ? NAV_ITEMS_HIRER
                : NAV_ITEMS_GUEST;

    return (
        <header className="site-header select-none">
            <div className="topbar">
                <div className="container topbar-inner">
                    <div className="brand">
                        <img className="brand-logo" src={kittyLogo} alt="Logo" />
                        <span className="brand-name">Nhóm 5</span>
                    </div>

                    <div className="top-actions">
                        {status === "AUTHENTICATED" && user ? <UserTopActions /> : <GuestTopActions />}
                    </div>
                </div>
            </div>

            <div className="navbar">
                <div className="container navbar-inner">
                    <nav className="header-nav" aria-label="Điều hướng chính">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                className={({ isActive }) =>
                                    `header-nav__link${isActive ? " header-nav__link--active" : ""}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
