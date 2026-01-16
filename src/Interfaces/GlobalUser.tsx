import React, { createContext, useContext, useEffect, useState } from 'react';
import apiFetch from './TokenAuthorization';
import type { UserData } from './userInterface';

const UserContext = createContext<{
    user: UserData | null;
    setUser: (data: UserData) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    loggedIn: boolean | null;
    setLoggedIn: (loggedIn: boolean | null) => void;
    verifyToken: () => Promise<void>;
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
    const [loggedIn, setLoggedIn] = useState<boolean | null>(false);

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

            if (response.ok) {
                const data = await response.json();

                if (data) {
                    setToken(data.accessToken);
                }

                const resumeUserData = await apiFetch('http://localhost:3000/users/getId', {
                    method: 'GET'
                }, data.accessToken)

                if (resumeUserData.ok) {
                    const userData = await resumeUserData.json();

                    if (userData) {
                        setUser(userData.data);
                        setLoggedIn(true);
                    }
                }

                return data.accessToken
            }

        } catch (error) {
            console.error('Failed to fetch token data', error);
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        verifyToken();
    }, [])

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, loggedIn, setLoggedIn, verifyToken }}>
            {children}
        </UserContext.Provider>
    );
};
