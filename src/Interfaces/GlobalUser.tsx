import React, { createContext, useContext, useEffect, useState } from 'react';
import apiFetch from './TokenAuthorization';
import type { UserData } from './userInterface';

const UserContext = createContext<{
    user: UserData | null;
    setUser: (data: UserData) => void;
    token: string | null;
    setToken: (token: string | null) => void;
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

            if (!response.ok){
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
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, loggedIn, setLoggedIn, verifyToken, authReady }}>
            {children}
        </UserContext.Provider>
    );
};
