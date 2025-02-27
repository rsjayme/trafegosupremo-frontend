"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { FacebookProvider } from "@/contexts/FacebookContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <FacebookProvider>
                {children}
            </FacebookProvider>
        </AuthProvider>
    );
}