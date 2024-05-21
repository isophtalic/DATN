'use client'
import React, { createContext } from 'react';
import useUserStore from '@/store/user';
import UserContext from './context';

type AuthProviderProps = {
    children?: React.ReactNode;
};

export const UserProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const store = useUserStore();

    return <UserContext.Provider value={store}>{children}</UserContext.Provider>
};
