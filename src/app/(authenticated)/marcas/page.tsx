"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, PencilSimple, Calendar } from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { brandsService } from "@/services/brands";
import { toast } from "sonner";
import { Brand } from "@/types/brand";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Marcas() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        async function loadBrands() {
            try {
                const data = await brandsService.listBrands();
                setBrands(data || []);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Erro ao carregar marcas');
                setBrands([]);
            } finally {
                setIsLoading(false);
            }
        }

        loadBrands();
    }, []);

    const handleCardClick = (brandId: number) => {
        router.push(`/marcas/${brandId}`);
    };

    const handleEditClick = (e: React.MouseEvent, brandId: number) => {
        e.stopPropagation();
        router.push(`/marcas/${brandId}/editar`);
    };

    return (
        <div className="flex-1 p-6">
            <div className="main-container space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Marcas</h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Gerencie suas marcas e conexões com o Facebook
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/marcas/criar")}
                        size="sm"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Nova Marca
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-6 space-y-4">
                                <div className="space-y-3">
                                    <div className="h-6 bg-gray-200 rounded-md w-3/4 animate-pulse" />
                                    <div className="h-4 bg-gray-100 rounded-md w-1/2 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="h-4 bg-gray-100 rounded-md w-1/3 animate-pulse" />
                                </div>
                                <div className="h-4 bg-gray-100 rounded-md w-2/3 animate-pulse" />
                            </Card>
                        ))}
                    </div>
                ) : brands.length === 0 ? (
                    <Card className="p-8 text-center">
                        <div className="max-w-sm mx-auto space-y-4">
                            <h3 className="text-lg font-semibold">Nenhuma marca cadastrada</h3>
                            <p className="text-sm text-muted-foreground">
                                Crie sua primeira marca para começar a gerenciar suas campanhas no Facebook.
                            </p>
                            <Button
                                onClick={() => router.push("/marcas/criar")}
                                className="mt-2"
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Criar Primeira Marca
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {brands.map((brand) => (
                            <Card
                                key={brand.id}
                                className="relative group transition-all hover:shadow-md"
                            >
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => handleCardClick(brand.id)}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                            {brand.name}
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => handleEditClick(e, brand.id)}
                                        >
                                            <PencilSimple className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            {brand.facebookAccount ? (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                                    <span className="text-green-600 font-medium">
                                                        Conectado ao Facebook
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                                                    <span className="text-gray-500">
                                                        Facebook não conectado
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {brand.facebookAccount && (
                                            <p className="text-sm text-muted-foreground">
                                                Conta: {brand.facebookAccount.name}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>
                                                Criada em {format(new Date(brand.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}