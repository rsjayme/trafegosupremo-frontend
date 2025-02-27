export const AUTH_STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'auth_user'
} as const;

export const COOKIE_OPTIONS = {
    path: '/',
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    expires: 30 // 30 dias
} as const;