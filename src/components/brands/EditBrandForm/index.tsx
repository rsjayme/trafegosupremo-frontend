"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { brandsService } from '@/services/brands';
import { Brand } from '@/types/brand';

interface EditBrandFormProps {
    brand: Brand;
    onSuccess?: () => void;
}

export function EditBrandForm({ brand, onSuccess }: EditBrandFormProps) {
    const [name, setName] = useState(brand.name);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error('Nome da marca é obrigatório');
            return;
        }

        if (name === brand.name) {
            toast.info('Nenhuma alteração realizada');
            return;
        }

        setIsLoading(true);
        try {
            await brandsService.updateBrand(brand.id, name);
            toast.success('Marca atualizada com sucesso!');
            onSuccess?.();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar marca');
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
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </form>
        </Card>
    );
}