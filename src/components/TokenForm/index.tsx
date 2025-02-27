"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useFacebook } from "@/contexts/FacebookContext";
import { toast } from "sonner";

const tokenSchema = z.object({
    accessToken: z.string().min(1, 'Token é obrigatório'),
    accountId: z.string().min(1, 'ID da conta é obrigatório'),
});

type TokenFormData = z.infer<typeof tokenSchema>;

export function TokenForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { connectAccount } = useFacebook();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TokenFormData>({
        resolver: zodResolver(tokenSchema),
        defaultValues: {
            accessToken: '',
            accountId: '',
        },
    });

    const onSubmit = useCallback(async (data: TokenFormData) => {
        setIsLoading(true);
        try {
            await connectAccount(data.accessToken, data.accountId);
            toast.success('Conta do Facebook conectada com sucesso!');
            reset();
        } catch (error) {
            console.error('Erro ao conectar conta:', error);
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Erro ao conectar conta do Facebook');
            }
        } finally {
            setIsLoading(false);
        }
    }, [connectAccount, reset]);

    return (
        <Card className="w-full max-w-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Conectar Conta do Facebook
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Insira o token de acesso e ID da sua conta do Facebook Ads
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="accessToken" className="text-sm font-medium">
                            Token de Acesso
                        </label>
                        <Input
                            id="accessToken"
                            type="text"
                            placeholder="Cole seu token de acesso aqui"
                            disabled={isLoading}
                            {...register('accessToken')}
                        />
                        {errors.accessToken && (
                            <p className="text-sm text-red-500">
                                {errors.accessToken.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="accountId" className="text-sm font-medium">
                            ID da Conta
                        </label>
                        <Input
                            id="accountId"
                            type="text"
                            placeholder="Ex: 123456789"
                            disabled={isLoading}
                            {...register('accountId')}
                        />
                        {errors.accountId && (
                            <p className="text-sm text-red-500">
                                {errors.accountId.message}
                            </p>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    variant={Object.keys(errors).length > 0 ? "destructive" : "default"}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Conectando...
                        </>
                    ) : (
                        "Conectar Conta"
                    )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Não sabe como obter o token?
                    <a
                        href="https://developers.facebook.com/docs/facebook-login/guides/access-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-primary hover:underline"
                    >
                        Consulte a documentação
                    </a>
                </p>
            </form>
        </Card>
    );
}
