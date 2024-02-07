import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { urlServerAuth } from '../App';  // Ensure this is correctly defined

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUserDetails = async () => {
        try {
            const { data } = await axios.get(`${urlServerAuth}/validate_token`, { withCredentials: true });
            setUser(data.user);  // Assuming the backend sends back user data
            localStorage.setItem('user', JSON.stringify(data.user));  // Update local storage if token still valid
        } catch (error) {
            console.error('Token validation failed:', error);
            logout();  // Ensure clean state if token is invalid
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${urlServerAuth}/login`, { username, password }, { withCredentials: true });
            const userData = response.data;  // Adjust based on actual response structure
            localStorage.setItem('user', JSON.stringify(userData.user));
            setUser(userData.user);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Call backend to invalidate the token
            await axios.post(`${urlServerAuth}/logout`, {}, { withCredentials: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
        // Clear user from local storage and state
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        fetchUserDetails();  // Validate token and fetch user details on component mount
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
