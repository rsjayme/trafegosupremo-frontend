"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { FacebookProvider } from "@/contexts/FacebookContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutos
            retry: 1,
        },
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <FacebookProvider>
                    <BrandProvider>
                        {children}
                    </BrandProvider>
                </FacebookProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}