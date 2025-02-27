"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Configuracoes() {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.replace("/login");
        }
    }, [token, router]);

    if (!token) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Redirecionando...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6">
            <div className="main-container">
                <h1 className="text-2xl font-semibold mb-6">Configurações</h1>
                <div className="bg-card p-6 rounded-lg shadow-sm border">
                    <p className="text-muted-foreground">
                        Configurações do sistema serão implementadas em breve
                    </p>
                </div>
            </div>
        </div>
    );
}