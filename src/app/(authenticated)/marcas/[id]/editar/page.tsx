"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CaretLeft } from "@phosphor-icons/react";
import { brandsService } from "@/services/brands";
import { toast } from "sonner";
import { EditBrandForm } from "@/components/brands/EditBrandForm";
import { Brand } from "@/types/brand";

export default function EditarMarca({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [brand, setBrand] = useState<Brand | null>(null);

    useEffect(() => {
        async function loadBrand() {
            try {
                const data = await brandsService.getBrand(Number(params.id));
                setBrand(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Erro ao carregar marca');
                router.push('/marcas');
            } finally {
                setIsLoading(false);
            }
        }

        loadBrand();
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <Card className="p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                    </Card>
                </div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <Card className="p-6 text-center">
                        <p className="text-muted-foreground">Marca não encontrada</p>
                    </Card>
                </div>
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
                    <h1 className="text-2xl font-semibold">Editar Marca</h1>
                </div>

                <div className="max-w-2xl">
                    <EditBrandForm
                        brand={brand}
                        onSuccess={() => router.push(`/marcas/${brand.id}`)}
                    />
                </div>
            </div>
        </div>
    );
}