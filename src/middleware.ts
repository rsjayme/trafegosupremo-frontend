import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas públicas que não precisam de autenticação
const publicRoutes = ['/login', '/register'];

// Lista de rotas que devem ser ignoradas pelo middleware
const ignoredRoutes = [
    '/api',
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/public'
];

const AUTH_TOKEN = 'auth_token';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Ignora rotas específicas
    if (ignoredRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    const token = request.cookies.get(AUTH_TOKEN);

    // Permite acesso a rotas públicas mesmo sem autenticação
    if (publicRoutes.includes(pathname)) {
        // Se já estiver autenticado e tentar acessar login/register, redireciona para dashboard
        if (token) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Se não tiver token e não for rota pública, redireciona para login
    if (!token) {
        const loginUrl = new URL('/login', request.url);
        // Salva a URL atual para redirecionar depois do login
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Se tiver token e for rota protegida, permite o acesso
    try {
        // Aqui poderíamos validar o token se necessário
        return NextResponse.next();
    } catch {
        // Se o token for inválido, redireciona para login
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

// Configuração de quais rotas o middleware deve verificar
export const config = {
    matcher: [
        // Aplica o middleware em todas as rotas exceto as ignoradas
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};