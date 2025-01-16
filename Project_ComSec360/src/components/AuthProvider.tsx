'use client';

import { userLogin } from '@/lib/api/auth/auth';
import { useAuthStore } from '@/services/authStore';
import {useEffect} from "react";

export const useAuthContext = () => {
    const { user, token, setUser, setToken, clearAuth } = useAuthStore.getState();

    const login = async (email: string, password: string) => {
        const response = await userLogin(email, password);
        if (response.success && response.data.token) {
            setUser(response.data.user);
            setToken(response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('type', response.data.user.type);
            return response;
        } else {
            console.log(response, "response");
            return response;
        }
    };

    const logout = () => {
        clearAuth();
        localStorage.removeItem('token');
        localStorage.removeItem('type');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const getUser = () => {
        if (typeof window === 'undefined') return false;
        const user = localStorage.getItem('user');
        if (user && Object.keys(JSON.parse(user)).length) {
            setUser(JSON.parse(user));
        } else if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
    };
    

    useEffect(() => {
        getUser();
    }, [])

    return { user, token, login, logout, getUser };
};
