"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CaretLeft } from "@phosphor-icons/react";
import { BrandForm } from "@/components/brands/BrandForm";

export default function CriarMarca() {
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
            <div className="main-container space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        <CaretLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-semibold">Criar Nova Marca</h1>
                </div>

                <div className="max-w-2xl">
                    <BrandForm />
                </div>
            </div>
        </div>
    );
}