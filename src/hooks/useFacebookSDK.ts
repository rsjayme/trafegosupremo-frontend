import { useEffect, useState } from 'react';
import {
    FacebookLoginResponse,
    FacebookApiResponse,
    FacebookApiError,
    FacebookLoginParams
} from '@/types/facebook';

export class FacebookSDKError extends Error {
    constructor(
        message: string,
        public code?: number,
        public type?: string
    ) {
        super(message);
        this.name = 'FacebookSDKError';
    }

    static fromApiError(error: FacebookApiError): FacebookSDKError {
        return new FacebookSDKError(error.message, error.code, error.type);
    }
}

export function useFacebookSDK() {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (window.FB) {
            setIsInitialized(true);
            return;
        }

        const handleInit = () => {
            setIsInitialized(true);
        };

        if (window.fbAsyncInit) {
            const originalInit = window.fbAsyncInit;
            window.fbAsyncInit = () => {
                originalInit();
                handleInit();
            };
        }
    }, []);

    const ensureInitialized = () => {
        if (!isInitialized) {
            throw new FacebookSDKError('Facebook SDK não está inicializado');
        }
    };

    const login = async (scope: string): Promise<FacebookLoginResponse> => {
        ensureInitialized();

        return new Promise((resolve) => {
            const params: FacebookLoginParams = {
                scope,
                return_scopes: true
            };

            window.FB.login(resolve, params);
        });
    };

    const getLoginStatus = async (): Promise<FacebookLoginResponse> => {
        ensureInitialized();

        return new Promise((resolve) => {
            window.FB.getLoginStatus(resolve);
        });
    };

    const api = async <T>(path: string): Promise<T> => {
        ensureInitialized();

        return new Promise((resolve, reject) => {
            window.FB.api(path, (response: FacebookApiResponse<T>) => {
                if (response.error) {
                    reject(FacebookSDKError.fromApiError(response.error));
                } else if (response.data) {
                    resolve(response.data);
                } else {
                    reject(new FacebookSDKError('Resposta inválida da API do Facebook'));
                }
            });
        });
    };

    return {
        isInitialized,
        login,
        getLoginStatus,
        api,
    } as const;
}