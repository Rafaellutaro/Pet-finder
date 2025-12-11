import React, { createContext, useContext, useEffect, useState } from 'react';
import apiFetch from './TokenAuthorization';

interface UserData {
    id: number;
    name: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;  
    addresses: any[];  
}

const UserContext = createContext<{
    user: UserData | null;
    setUser: (data: UserData) => void;
    token: string | null;
    setToken: (token: string | null) => void;
    loggedIn: boolean | null;
    setLoggedIn: (loggedIn: boolean | null) => void;
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

    

        const verifyToken = async () => {
            try {
                const response = await fetch('http://localhost:3000/users/refreshToken', {
                    method: 'POST',
                    credentials: 'include'
                }); 
                const data = await response.json();

                if (data) {
                    setToken(data); 
                }

                const resumeUserData = await apiFetch('http://localhost:3000/users/getId', {
                    method: 'GET'
                }, data.accessToken)

                const userData = await resumeUserData.json();

                setUser(userData.data);
                setLoggedIn(true);

            } catch (error) {
                console.error('Failed to fetch token data', error);
                setLoggedIn(false);
            }
        };

        useEffect(() => {
            verifyToken();
        }, [])

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, loggedIn, setLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};
