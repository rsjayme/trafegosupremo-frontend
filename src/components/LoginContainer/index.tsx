"use client";

import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginContainer() {
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token) {
            router.replace("/dashboard");
        }
    }, [token, router]);

    if (token) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Redirecionando...</p>
            </div>
        );
    }

    return <LoginForm />;
}