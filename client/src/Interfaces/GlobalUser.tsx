import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import apiFetch from './TokenAuthorization';
import type { UserData } from './userInterface';
import { getSocket } from '../components/socket';
import type { Socket } from 'socket.io-client';
import type { NotificationItem } from './notificationInterface';
import {loadUnread, onSocketNotification} from "../components/reusable/notification"


const UserContext = createContext<{
    user: UserData | null;
    setUser: (data: UserData) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    socket: Socket | null;
    notification: NotificationItem[];
    setNotification: React.Dispatch<React.SetStateAction<NotificationItem[]>>
    loggedIn: boolean;
    setLoggedIn: (loggedIn: boolean) => void;
    verifyToken: () => Promise<void>;
    authReady: boolean;
} | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC = ({ children }: React.PropsWithChildren<{}>) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [authReady, setAuthReady] = useState<boolean>(false);
    const [notification, setNotification] = useState<NotificationItem[]>([]);
    const socketRef = useRef<Socket | null>(null)
    // =================================================================================
    // video used to understand this: https://www.youtube.com/watch?v=AcYF18oGn6Y&t=742s
    // =================================================================================

    // i will save some tutorials in case i forget or get lost.

    const verifyToken = async () => {
        try {
            const response = await fetch('http://localhost:3000/users/refreshToken', {
                method: 'POST',
                credentials: 'include'
            });

            if (!response.ok) {
                return null
            }

            const data = await response.json();
            return data.accessToken;


        } catch (error) {
            console.error('Failed to fetch token data', error);
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        console.log("running....")
        let cancelled = false;

        const initAuth = async () => {
            try {
                const res = await fetch(
                    "http://localhost:3000/users/refreshToken",
                    { method: "POST", credentials: "include" }
                );

                if (!res.ok) throw new Error("No session");

                const data = await res.json();
                setToken(data.accessToken);
                setLoggedIn(true);

                const userRes = await apiFetch(
                    "http://localhost:3000/users/getId",
                    { method: "GET" },
                    data.accessToken
                );

                if (userRes.ok) {
                    const u = await userRes.json();
                    setUser(u.data);
                }
            } catch {
                setUser(null);
                setToken(null);
                setLoggedIn(false);
            } finally {
                if (!cancelled) setAuthReady(true);
            }
        };

        initAuth();
        return () => { cancelled = true };
    }, [token]);

    useEffect(() => {
        if (!token) {
            socketRef.current?.disconnect();
            socketRef.current = null;
            return;
        };

        const sk = getSocket(String(token));
        sk.auth = { token };

        if (!sk.connected) sk.connect();

        socketRef.current = sk;
    }, [token])

    useEffect(() => {
        const socket = socketRef?.current
        if (!socket) return

        const handleNotification = ({ notification }: any) => {
            if (!notification || typeof notification !== "object") return;

            console.log("new notification", notification);

            onSocketNotification(notification, setNotification)
        };

        socket.on("notification:new", handleNotification)

        // notification functions
        const getallUnread = async () => {
            await loadUnread(setNotification, String(token), verifyToken)
        }

        getallUnread()
    }, [token])

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, loggedIn, setLoggedIn, verifyToken, authReady, socket: socketRef.current, notification, setNotification }}>
            {children}
        </UserContext.Provider>
    );
};
