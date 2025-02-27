"use client";

import { LoginForm } from "@/components/LoginForm";
import { AuthRedirect } from "@/components/AuthRedirect";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const { isLoading, token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && token) {
            // Se já estiver autenticado, redireciona para o dashboard
            router.replace('/dashboard');
        }
    }, [isLoading, token, router]);

    // Estado de carregamento inicial
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    // Se não estiver autenticado, mostra o formulário
    if (!token) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
                <LoginForm />
            </div>
        );
    }

    // Componente de redirecionamento (será renderizado após login bem-sucedido)
    return <AuthRedirect />;
}