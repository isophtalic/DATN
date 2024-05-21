'use client'
import React, { createContext } from 'react';

const UserContext = createContext<UserState>({
    user: {
        id: "",
        username: "",
        password: "",
        role: 0,
        updated_at: "0",
    },
    islogin: false,
    login: () => { },
    update: () => { }
});

export default UserContext;