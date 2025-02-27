"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";

function LayoutContent({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    if (!token) {
        return children;
    }

    return (
        <div className="min-h-screen flex">
            <div className="flex-1 flex flex-col">
                <Header />
                {children}
            </div>
        </div>
    );
}

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <AccountProvider>
                <LayoutContent>{children}</LayoutContent>
            </AccountProvider>
        </AuthProvider>
    );
}
