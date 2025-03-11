import api from '@/lib/api';

interface AuthData {
    email: string;
    password: string;
}

interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

interface ChangePasswordData {
    currentPassword: string;
    newPassword: string;
}

interface LoginResponse {
    access_token: string;
    user: User;
}

interface RegisterData extends AuthData {
    name: string;
}

interface ApiError {
    message: string;
    statusCode: number;
}

interface ApiErrorResponse {
    isAxiosError: boolean;
    response?: {
        data: ApiError;
        status: number;
    };
}

const isApiError = (error: unknown): error is ApiErrorResponse => {
    return typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        Boolean(error.isAxiosError);
};

export const authService = {
    async login(data: AuthData): Promise<LoginResponse> {
        try {
            console.log('Tentando fazer login com:', { email: data.email });
            const response = await api.post<LoginResponse>('/auth/login', data);
            console.log('Resposta do login:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Erro durante login:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao fazer login. Tente novamente.');
        }
    },

    async register(data: RegisterData): Promise<User> {
        try {
            console.log('Tentando registrar usuário:', { email: data.email });
            const response = await api.post<User>('/auth/register', data);
            console.log('Resposta do registro:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Erro durante registro:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao registrar usuário. Tente novamente.');
        }
    },

    async getProfile(token: string): Promise<User> {
        try {
            console.log('Tentando obter perfil com token:', token.substring(0, 10) + '...');
            const response = await api.get<User>('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Resposta do perfil:', response.data);
            return response.data;
        } catch (error: unknown) {
            console.error('Erro ao obter perfil:', error);
            if (isApiError(error)) {
                if (error.response?.status === 401) {
                    throw new Error('Sessão expirada. Faça login novamente.');
                }
                if (error.response?.data) {
                    throw new Error(error.response.data.message);
                }
            }
            throw new Error('Erro ao obter perfil. Tente novamente.');
        }
    },

    async changePassword(data: ChangePasswordData): Promise<void> {
        try {
            console.log('Tentando alterar senha');
            await api.post('/users/change-password', data);
            console.log('Senha alterada com sucesso');
        } catch (error: unknown) {
            console.error('Erro ao alterar senha:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao alterar senha. Tente novamente.');
        }
    }
};