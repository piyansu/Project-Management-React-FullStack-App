import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUserSession = useCallback(async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/profile`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Not authenticated');
            }

            // If the request is successful, the user is logged in.
            setUser(data.user);

        } catch (error) {
            // If the request fails, it means there's no valid session.
            console.error("Session Check Error:", error.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkUserSession();
    }, [checkUserSession]);

    const login = async (email, password) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed.');
            }
            
            // REMOVED: We no longer save the token in localStorage.
            
            // Set the user state from the successful login response.
            setUser(data.user);

        } catch (error) {
            throw error;
        }
    };

    const loginWithGoogle = async (code) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_URL_BACKEND}/auth/google-login`,
                { code },
                { withCredentials: true } // Important to handle the httpOnly cookie
            );

            const data = response.data;
            
            if (response.status !== 200) {
                throw new Error(data.message || 'Google login failed.');
            }
            
            // Set the user state from the successful login response.
            setUser(data.user);

        } catch (error) {
            // Re-throw the error so the component can catch it and display a message
            throw error.response?.data || error;
        }
    };

    const logout = useCallback(async () => {
        try {
            // Call the backend logout endpoint to clear the httpOnly cookie.
            await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/logout`, {
                method: 'GET',
                credentials: 'include',
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // Always clear the user state on the frontend regardless of backend success.
            setUser(null);
        }
    }, []);


    const isLoggedin = !!user;

    const value = {
        user,
        isLoggedin,
        loading,
        login,
        logout,
        loginWithGoogle,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);