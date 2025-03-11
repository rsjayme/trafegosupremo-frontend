'use client';

import { useState } from 'react';
import { authService } from '@/services/auth';
import { toast } from 'sonner';

export function PasswordChange() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem');
            setLoading(false);
            return;
        }

        try {
            await authService.changePassword({
                currentPassword,
                newPassword,
            });
            toast.success('Senha alterada com sucesso');
            form.reset();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <h4 className="text-sm font-medium">Alterar Senha</h4>
                <p className="text-sm text-muted-foreground">
                    Atualize sua senha para manter sua conta segura
                </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Senha Atual
                    </label>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        required
                        className="w-full p-2 rounded-md border border-input bg-background"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        Nova Senha
                    </label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        required
                        minLength={6}
                        className="w-full p-2 rounded-md border border-input bg-background"
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirmar Nova Senha
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        className="w-full p-2 rounded-md border border-input bg-background"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                >
                    {loading ? 'Alterando...' : 'Alterar Senha'}
                </button>
            </form>
        </div>
    );
}