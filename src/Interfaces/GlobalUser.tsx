import React, { createContext, useContext, useState } from 'react';

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

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
