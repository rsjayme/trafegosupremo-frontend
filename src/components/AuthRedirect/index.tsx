"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function AuthRedirect() {
    const { token, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get("callbackUrl");

    useEffect(() => {
        if (!isLoading) {
            if (token) {
                // Se houver uma URL de callback, redireciona para ela
                if (callbackUrl) {
                    router.push(callbackUrl);
                } else {
                    // Caso contrário, vai para o dashboard
                    router.push("/dashboard");
                }
            }
        }
    }, [token, isLoading, router, callbackUrl]);

    return null; // Este componente não renderiza nada, apenas lida com redirecionamento
}