"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CaretLeft } from "@phosphor-icons/react";
import { BrandForm } from "@/components/brands/BrandForm";

export default function CriarMarca() {
    const router = useRouter();

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