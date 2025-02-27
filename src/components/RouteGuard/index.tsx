"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export function RouteGuard({ children, requiredRoles = [] }: RouteGuardProps) {
    const { token, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!token) {
                router.push('/login');
            } else if (requiredRoles.length > 0) {
                // Se há roles requeridas, verifica se o usuário tem permissão
                const hasRequiredRole = user && requiredRoles.includes(user.role);
                if (!hasRequiredRole) {
                    // Redireciona para o dashboard se não tiver permissão
                    router.push('/dashboard');
                }
            }
        }
    }, [isLoading, token, user, router, requiredRoles]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    // Se não há roles requeridas ou o usuário tem as permissões necessárias
    if (!requiredRoles.length || (user && requiredRoles.includes(user.role))) {
        return <>{children}</>;
    }

    // Caso contrário, não renderiza nada (já redirecionou no useEffect)
    return null;
}