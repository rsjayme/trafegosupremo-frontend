"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function AuthenticatedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
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
        <div className="flex">
            <Sidebar />
            {children}
        </div>
    );
}