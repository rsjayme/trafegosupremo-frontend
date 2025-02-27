import axios from 'axios';
import Cookies from 'js-cookie';
import { AUTH_STORAGE_KEYS, COOKIE_OPTIONS } from '@/constants/auth';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

interface ErrorResponse {
    code?: number;
    message?: string;
    statusCode?: number;
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use((config) => {
    // Tenta pegar o token primeiro do cookie, depois do localStorage
    const token = Cookies.get(AUTH_STORAGE_KEYS.TOKEN) ||
        localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const axiosError = error as {
            response?: {
                status: number;
                data: ErrorResponse;
            };
            message: string;
        };

        // Erros específicos do Facebook
        if (axiosError.response?.data?.code) {
            switch (axiosError.response.data.code) {
                case 190:
                    throw new Error('Token do Facebook expirado');
                case 17:
                    throw new Error('Limite de requisições excedido');
                case 200:
                    throw new Error('Permissão negada pelo Facebook');
                case 272:
                    throw new Error('Conta do Facebook restrita');
                default:
                    break;
            }
        }

        // Erros gerais da API
        if (axiosError.response?.status === 401) {
            // Remove o token de ambos os lugares
            localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
            Cookies.remove(AUTH_STORAGE_KEYS.TOKEN, COOKIE_OPTIONS);

            // Se não estivermos já na página de login, redireciona
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            throw new Error('Sessão expirada');
        }

        // Se houver um código de status, pode ser um erro da API
        if (axiosError.response?.data?.statusCode) {
            throw new Error(axiosError.response.data.message || 'Erro no servidor');
        }

        const errorMessage = axiosError.response?.data?.message || axiosError.message;
        throw new Error(errorMessage || 'Erro na requisição');
    }
);

export default api;