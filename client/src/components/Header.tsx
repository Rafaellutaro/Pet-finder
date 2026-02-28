import "../assets/css/header.css";
import "../assets/css/notification.css";
import { FaTimes, FaUserCircle } from "react-icons/fa";
import { MdPets } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaBars, FaShieldDog } from "react-icons/fa6";
import { useUser } from "../Interfaces/GlobalUser";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegBell } from "react-icons/fa";
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigateWithFrom } from "./reusable/Redirect";
import type { NotificationItem } from "../Interfaces/notificationInterface";
import { setAsRead, setAllAsRead } from "./reusable/notification"
import { HiOutlineChatBubbleOvalLeft } from "react-icons/hi2";


function Header() {
    const { loggedIn, user, notification, token, verifyToken, setNotification } = useUser();
    const [bellOpen, setBellOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const chatRedirect = useNavigateWithFrom()

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

    const notifications: NotificationItem[] = notification

    const newCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications]
    );

    return (
        <div className="header-container">
            <div className="header-icon">
                <Link to="/">
                    <FaShieldDog />
                </Link>
            </div>

            <button
                type="button"
                className="mobile-menu-btn"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="header-menu"
                onClick={() => setMenuOpen((v) => !v)}
            >
                {menuOpen ? <FaTimes /> : <FaBars />}
            </button>

            <nav
                id="header-menu"
                className={`header-items ${menuOpen ? "is-open" : ""}`}
            >
                <ul className="header-actions" onClick={() => setMenuOpen(false)}>
                    <li className="user-avatar">
                        <Link to={link} aria-label="Profile">
                            {user?.profileImg ? (
                                <img src={user.profileImg} alt="User profile" />
                            ) : (
                                <FaUserCircle className="userIcon" />
                            )}
                            <span className="mobile-label">Perfil</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Pets" aria-label="Pets">
                            <MdPets />
                            <span className="mobile-label">Pets</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Chat" aria-label="Chats">
                            <HiOutlineChatBubbleOvalLeft />
                            <span className="mobile-label">Chats</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Settings" aria-label="Settings">
                            <IoSettingsOutline />
                            <span className="mobile-label">Configurações</span>
                        </Link>
                    </li>

                    <li className="bell-wrap" ref={bellWrapRef}>
                        <button
                            type="button"
                            className="bell"
                            onClick={(e) => {
                                e.stopPropagation()
                                setBellOpen(v => !v)
                            }}
                            aria-expanded={bellOpen}
                            aria-label="Open notifications"
                        >
                            <FaRegBell />

                            {newCount > 0 && (
                                <span className="bell-counter" aria-label={`${newCount} new notifications`}>
                                    {newCount}
                                </span>
                            )}

                            <span className="mobile-label">Notificações</span>
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
                                                setAllAsRead(String(token), verifyToken, setNotification)
                                            }}
                                        >
                                            Marcar todas como lidas
                                        </button>
                                    </div>

                                    <div className="right-side-notification-header">
                                        {newCount > 0 && (
                                            <span className="notification-new-badge">{newCount} Novo</span>
                                        )}
                                    </div>
                                </div>

                                <div className="notification-body">
                                    {notifications.length == 0 ? (
                                        <div className="notification-empty">
                                            <span className="notification-empty-title">Nenhuma Notificação</span>
                                            <span className="notification-empty-sub">você está atualizado</span>
                                        </div>
                                    ) : (
                                        notifications.map((n) => (

                                            <button
                                                key={n.id}
                                                type="button"
                                                className={`notification-row ${n.isRead ? "is-read" : "is-unread"}`}
                                                onClick={() => {
                                                    chatRedirect(n.link)
                                                    setAsRead(String(token), verifyToken, String(n.id), setNotification)
                                                }}
                                            >
                                                <div className="left-icon-notification-body">
                                                    <span className={`notification-icon-bubble ${n.type || ""}`}>
                                                        {n.icon}
                                                    </span>
                                                </div>

                                                <div className="notification-body-content">
                                                    <span className="notification-title">{n.title}</span>
                                                    <span className="notification-content">{n.body}</span>
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
            </nav>
        </div>
    );
}

export default Header;
