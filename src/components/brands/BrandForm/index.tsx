"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { brandsService } from '@/services/brands';
import { useRouter } from 'next/navigation'


export function BrandForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Nome da marca é obrigatório');
            return;
        }

        setIsLoading(true);
        try {
            await brandsService.createBrand(name);
            toast.success('Marca criada com sucesso!');
            router.push('/marcas');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao criar marca');
        } finally {
            setIsLoading(false);
        }
    };


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