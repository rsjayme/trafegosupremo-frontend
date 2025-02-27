"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/auth";
import api from "@/lib/api";
import Cookies from 'js-cookie';
import { AUTH_STORAGE_KEYS, COOKIE_OPTIONS } from '@/constants/auth';

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData extends LoginData {
    name: string;
}

interface AuthContextType {
    token: string | null;
    user: User | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const setAuthToken = (newToken: string) => {
        // Função auxiliar para configurar o token em todos os lugares necessários
        localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, newToken);
        Cookies.set(AUTH_STORAGE_KEYS.TOKEN, newToken, COOKIE_OPTIONS);
        setToken(newToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    };

    useEffect(() => {
        const initializeAuth = async () => {
            // Tenta pegar o token primeiro do cookie, depois do localStorage
            const storedToken = Cookies.get(AUTH_STORAGE_KEYS.TOKEN) ||
                localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

            if (storedToken) {
                try {
                    const userData = await authService.getProfile(storedToken);
                    setAuthToken(storedToken);
                    setUser(userData);
                } catch (error) {
                    console.error('Erro ao recuperar perfil:', error);
                    handleLogout();
                }
            }

            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const handleLogin = async (data: LoginData) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await authService.login(data);
            const { access_token, user: userData } = response;

            console.log('Login bem-sucedido:', response);

            setAuthToken(access_token);
            localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(userData));
            setUser(userData);

        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao fazer login');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (data: RegisterData) => {
        try {
            setError(null);
            setIsLoading(true);

            await authService.register(data);
            // Após o registro, faz login automaticamente
            await handleLogin({
                email: data.email,
                password: data.password
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao registrar');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        // Remove o token de todos os lugares
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
        Cookies.remove(AUTH_STORAGE_KEYS.TOKEN, COOKIE_OPTIONS);

        // Limpa o estado
        setToken(null);
        setUser(null);
        setError(null);

        // Limpa o token do Axios
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login: handleLogin,
                register: handleRegister,
                logout: handleLogout,
                isLoading,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
