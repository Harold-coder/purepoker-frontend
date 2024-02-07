import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { urlServerAuth } from '../App';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const login = async (username, password) => {
        try {
            const { data } = await axios.post(`${urlServerAuth}/login`, { username, password }, { withCredentials: true });
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            console.log("USER:", data.user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error; // Rethrow the error so it can be caught and handled in the login component
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // Automatically log in the user if user data is in local storage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log(storedUser);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
