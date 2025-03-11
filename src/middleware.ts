import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = new Set([
    // Rotas do sistema
    '/api',
    '/_next',
    '/favicon.ico',
    '/public',
    // Rotas públicas da aplicação
    '/login',
    '/register',
    '/privacy-policy',
    '/terms-of-service'
]);

const AUTH_TOKEN = 'auth_token';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log('Current pathname:', pathname);

    // Verifica se o path atual começa com alguma rota pública
    const isPublicPath = Array.from(PUBLIC_PATHS).some(
        path => pathname === path || pathname.startsWith(`${path}/`)
    );

    // Se for uma rota pública, permite o acesso
    if (isPublicPath) {
        return NextResponse.next();
    }

    // Verifica autenticação
    const token = request.cookies.get(AUTH_TOKEN);
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configuração de quais rotas o middleware deve verificar
export const config = {
    matcher: '/(.*)',
};