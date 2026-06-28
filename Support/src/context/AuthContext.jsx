import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getStoredUser, login as loginService, logout as logoutService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = getStoredUser();

        if (storedUser) {
            setUser(storedUser);
        }

        setLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        const result = await loginService(email, password);
        setUser(result.user);
        return result;
    }, []);

    const logout = useCallback(() => {
        logoutService();
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({ user, loading, login, logout }),
        [user, loading, login, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};
