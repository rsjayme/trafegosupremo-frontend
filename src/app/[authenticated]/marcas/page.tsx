"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { brandsService } from "@/services/brands";
import { toast } from "sonner";

interface Brand {
    id: number;
    name: string;
    facebookAccount?: {
        id: number;
        accountId: string;
        name: string;
        status: string;
    };
}

export default function Marcas() {
    const { token } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        async function loadBrands() {
            try {
                const data = await brandsService.listBrands();
                setBrands(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Erro ao carregar marcas');
            } finally {
                setIsLoading(false);
            }
        }

        loadBrands();
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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Marcas</h1>
                    <Button
                        onClick={() => router.push("/marcas/criar")}
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Criar Nova Marca
                    </Button>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        <Card className="p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                        </Card>
                        <Card className="p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
                            <div className="h-3 bg-gray-100 rounded w-3/4" />
                        </Card>
                    </div>
                ) : brands.length === 0 ? (
                    <Card className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">
                            Você ainda não possui nenhuma marca cadastrada.
                        </p>
                        <Button
                            onClick={() => router.push("/marcas/criar")}
                            variant="outline"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Criar Primeira Marca
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {brands.map((brand) => (
                            <Card
                                key={brand.id}
                                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => router.push(`/marcas/${brand.id}`)}
                            >
                                <h3 className="text-lg font-semibold mb-2">{brand.name}</h3>
                                {brand.facebookAccount ? (
                                    <div className="text-sm text-muted-foreground">
                                        <p className="mb-1">
                                            Facebook: {brand.facebookAccount.name}
                                        </p>
                                        <p className={`capitalize ${brand.facebookAccount.status === 'active'
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}>
                                            Status: {brand.facebookAccount.status}
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Facebook não conectado
                                    </p>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}