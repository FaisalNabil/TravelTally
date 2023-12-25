import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    useEffect(() => {
        // Check if user data is stored in local storage
        const storedUser = localStorage.getItem('user');
        console.log("User:");
        console.log(storedUser);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false); // Set loading to false after checking user
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);