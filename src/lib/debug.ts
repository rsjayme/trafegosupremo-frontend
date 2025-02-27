import { AUTH_STORAGE_KEYS } from "@/constants/auth";
import Cookies from 'js-cookie';

interface AuthDebugInfo {
    localStorage: {
        token: string | null;
        user: string | null;
    };
    cookies: {
        token: string | undefined;
    };
    timestamp: string;
}

declare global {
    interface Window {
        debugAuth: () => AuthDebugInfo;
        clearAuthDebug: () => void;
    }
}

export const debugAuth = (): AuthDebugInfo => {
    const info: AuthDebugInfo = {
        localStorage: {
            token: localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN),
            user: localStorage.getItem(AUTH_STORAGE_KEYS.USER),
        },
        cookies: {
            token: Cookies.get(AUTH_STORAGE_KEYS.TOKEN),
        },
        timestamp: new Date().toISOString(),
    };

    console.group('🔐 Auth Debug Info');
    console.log('LocalStorage Token:', info.localStorage.token ? '✅ Present' : '❌ Missing');
    console.log('Cookie Token:', info.cookies.token ? '✅ Present' : '❌ Missing');
    console.log('User Data:', info.localStorage.user ? '✅ Present' : '❌ Missing');
    console.log('Full Token (localStorage):', info.localStorage.token);
    console.log('Full Token (cookie):', info.cookies.token);
    if (info.localStorage.user) {
        console.log('User:', JSON.parse(info.localStorage.user));
    }
    console.log('Timestamp:', info.timestamp);
    console.groupEnd();

    return info;
};

export const clearAuthDebug = () => {
    console.group('🧹 Clearing Auth Data');

    // Limpa localStorage
    localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    console.log('LocalStorage cleared ✅');

    // Limpa cookies
    Cookies.remove(AUTH_STORAGE_KEYS.TOKEN, { path: '/' });
    console.log('Cookies cleared ✅');

    console.groupEnd();
};

// Adiciona ao window para acesso fácil no console
if (typeof window !== 'undefined') {
    window.debugAuth = debugAuth;
    window.clearAuthDebug = clearAuthDebug;
}