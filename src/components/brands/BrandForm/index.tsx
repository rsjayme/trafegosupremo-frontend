"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { brandsService } from '@/services/brands';
import { FacebookConnect } from '../FacebookConnect';
import { Brand } from '@/types/brand';

export function BrandForm() {
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [createdBrand, setCreatedBrand] = useState<Brand | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Nome da marca é obrigatório');
            return;
        }

        setIsLoading(true);
        try {
            const brand = await brandsService.createBrand(name);
            setCreatedBrand(brand);
            toast.success('Marca criada com sucesso!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao criar marca');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacebookConnect = async (data: { accessToken: string; accountId: string }) => {
        if (!createdBrand) return;

        try {
            await brandsService.connectFacebook(createdBrand.id, data.accessToken, data.accountId);
            toast.success('Conta do Facebook conectada com sucesso!');
            // Redireciona para a página da marca após conectar
            window.location.href = `/marcas/${createdBrand.id}`;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao conectar conta do Facebook');
        }
    };

    if (createdBrand) {
        return (
            <FacebookConnect
                brandId={createdBrand.id}
                onConnect={handleFacebookConnect}
            />
        );
    }

    return (
        <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                        Nome da Marca
                    </label>
                    <Input
                        id="name"
                        placeholder="Digite o nome da sua marca"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? 'Criando...' : 'Criar Marca'}
                </Button>
            </form>
        </Card>
    );
}