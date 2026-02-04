import "../assets/css/header.css";
import "../assets/css/notification.css";
import { FaUserCircle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaShieldDog } from "react-icons/fa6";
import { useUser } from "../Interfaces/GlobalUser";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { useMemo, useRef, useState, useEffect } from "react";

type NotificationItem = {
    id: string | number;
    title: string;
    content: string;
    date: string;
    icon: React.ReactNode;
    read: boolean;
    type?: "message" | "chatCreated";
};

function Header() {
    const { loggedIn, user } = useUser();
    const [bellOpen, setBellOpen] = useState(false);

    const bellWrapRef = useRef<HTMLLIElement | null>(null);

    useEffect(() => {
        function onDocMouseDown(e: MouseEvent) {
            if (!bellWrapRef.current) return;
            const target = e.target as Node;
            if (!bellWrapRef.current.contains(target)) setBellOpen(false);
        }
        if (bellOpen) document.addEventListener("mousedown", onDocMouseDown);
        return () => document.removeEventListener("mousedown", onDocMouseDown);
    }, [bellOpen]);

    const link = loggedIn ? "/Profile" : "/Login";

    const notifications: NotificationItem[] = [
        {
            id: 1,
            title: "title",
            content: "content",
            date: "2 minutes ago",
            icon: <FaRegBell />,
            read: false,
            type: "chatCreated",
        },
        
    ];

    const newCount = useMemo(
        () => notifications.filter((n) => !n.read).length,
        [notifications]
    );

    return (
        <div className="header-container">
            <div className="header-icon">
                <Link to="/">
                    <FaShieldDog />
                </Link>
            </div>

            <div className="header-items">
                <ul className="header-actions">
                    <li className="user-avatar">
                        <Link to={link} aria-label="Profile">
                            {user?.profileImg ? (
                                <img src={user.profileImg} alt="User profile" />
                            ) : (
                                <FaUserCircle className="userIcon" />
                            )}
                        </Link>
                    </li>

                    <li>
                        <Link to="/Pets" aria-label="Pets">
                            <MdPets />
                        </Link>
                    </li>

                    <li>
                        <Link to="/Settings" aria-label="Settings">
                            <IoSettingsOutline />
                        </Link>
                    </li>

                    <li className="bell-wrap" ref={bellWrapRef}>
                        <button
                            type="button"
                            className="bell"
                            onClick={() => setBellOpen(v => !v)}
                            aria-expanded={bellOpen}
                            aria-label="Open notifications"
                        >
                            <FaRegBell />

                            {newCount > 0 && (
                                <span className="bell-counter" aria-label={`${newCount} new notifications`}>
                                    {newCount}
                                </span>
                            )}
                        </button>

                        {bellOpen && (
                            <div className="notification-container">
                                <div className="notification-header">
                                    <div className="left-side-notification-header">
                                        <span className="notification-header-title">
                                            <FaRegBell /> Notificações
                                        </span>

                                        <button
                                            type="button"
                                            className="notification-mark-read"
                                            onClick={() => {
                                                /* markAllAsRead() */
                                            }}
                                        >
                                            Marcar todas como lidas
                                        </button>
                                    </div>

                                    <div className="right-side-notification-header">
                                        {newCount > 0 && (
                                            <span className="notification-new-badge">{newCount} new</span>
                                        )}
                                    </div>
                                </div>

                                <div className="notification-body">
                                    {notifications.length === 0 ? (
                                        <div className="notification-empty">
                                            <span className="notification-empty-title">Nenhuma Notificação</span>
                                            <span className="notification-empty-sub">você está atualizado</span>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (
                                            <button
                                                key={n.id}
                                                type="button"
                                                className={`notification-row ${n.read ? "is-read" : "is-unread"}`}
                                                onClick={() => {
                                                    /* openNotification(n) */
                                                }}
                                            >
                                                <div className="left-icon-notification-body">
                                                    <span className={`notification-icon-bubble ${n.type || ""}`}>
                                                        {n.icon}
                                                    </span>
                                                </div>

                                                <div className="notification-body-content">
                                                    <span className="notification-title">{n.title}</span>
                                                    <span className="notification-content">{n.content}</span>
                                                    <span className="notification-date">{n.date}</span>
                                                </div>

                                                <span className="notification-unread-dot" aria-hidden="true" />
                                            </button>
                                        ))
                                    )}
                                </div>

                                <div className="bellow-header">
                                    <button
                                        type="button"
                                        className="notification-view-all"
                                        onClick={() => {
                                            /* navigate("/notifications") */
                                        }}
                                    >
                                        Ver todas as notificações
                                    </button>
                                </div>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;
