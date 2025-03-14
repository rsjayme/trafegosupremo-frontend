"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CaretLeft, PlugsConnected, Power } from "@phosphor-icons/react";
import { brandsService } from "@/services/brands";
import { toast } from "sonner";
import { FacebookConnectButton } from "@/components/brands/FacebookConnect";
import { Brand } from "@/types/brand";

interface DetalheParams {
    id: string;
}

export default function DetalheMarca({ params }: { params: Promise<DetalheParams> }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [brand, setBrand] = useState<Brand | null>(null);
    const resolvedParams = use(params);

    const loadBrand = async () => {
        try {
            const data = await brandsService.getBrand(Number(resolvedParams.id));
            setBrand(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao carregar marca');
            router.push('/marcas');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadBrand();
    }, [resolvedParams.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleConnect = async () => {
        if (!brand) return;
        try {
            // A lógica de conexão foi movida para o componente FacebookConnectButton
            await loadBrand(); // Recarrega os dados da marca após a conexão
            toast.success('Conta do Facebook conectada com sucesso!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao conectar conta do Facebook');
        }
    };

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
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-semibold">{brand.name}</h1>
                        {brand.facebookAccount ? (
                            <PlugsConnected
                                className="h-5 w-5 text-green-600"
                                weight="fill"
                            />
                        ) : (
                            <Power
                                className="h-5 w-5 text-gray-400"
                                weight="regular"
                            />
                        )}
                    </div>
                </div>

                {brand.facebookAccount ? (
                    <Card className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Conta do Facebook</h2>
                        <div className="space-y-2">
                            <p>
                                <span className="text-muted-foreground">Nome:</span>{" "}
                                {brand.facebookAccount.name}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Status:</span>{" "}
                                <span className={brand.facebookAccount.status === 'active' ? 'text-green-600' : 'text-red-600'}>
                                    {brand.facebookAccount.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </p>
                        </div>
                    </Card>
                ) : (
                    <FacebookConnectButton
                        brandId={brand.id}
                        onConnect={handleConnect}
                    />
                )}
            </div>
        </div>
    );
}