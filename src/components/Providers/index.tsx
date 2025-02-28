"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { BrandProvider } from "@/contexts/BrandContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <FacebookProvider>
                <BrandProvider>
                    {children}
                </BrandProvider>
            </FacebookProvider>
        </AuthProvider>
    );
}