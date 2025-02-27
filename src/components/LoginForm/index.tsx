"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string()
        .email('Email inválido')
        .min(1, 'Email é obrigatório'),
    password: z.string()
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .min(1, 'Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const { login, isLoading } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            // Agora apenas mostramos o toast de sucesso
            // O redirecionamento será feito pelo AuthRedirect
            toast.success('Login realizado com sucesso!');
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('credenciais')) {
                    setError('email', { message: 'Credenciais inválidas' });
                    setError('password', { message: 'Credenciais inválidas' });
                } else {
                    toast.error(error.message);
                }
            } else {
                toast.error('Erro ao fazer login. Tente novamente.');
            }
        }
    };

    return (
        <Card className="w-full max-w-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Login
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Digite suas credenciais para acessar
                    </p>
                </div>

                <FormField
                    label="Email"
                    type="email"
                    placeholder="exemplo@email.com"
                    error={errors.email?.message}
                    disabled={isLoading}
                    {...register('email')}
                />

                <FormField
                    label="Senha"
                    type="password"
                    placeholder="******"
                    error={errors.password?.message}
                    disabled={isLoading}
                    {...register('password')}
                />

                <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                    variant={errors.email || errors.password ? "destructive" : "default"}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                        </>
                    ) : (
                        "Entrar"
                    )}
                </Button>
            </form>
        </Card>
    );
}