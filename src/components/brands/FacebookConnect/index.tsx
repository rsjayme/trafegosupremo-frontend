"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFacebookSDK } from "@/hooks/useFacebookSDK";
import { toast } from "sonner";
import { brandsService } from "@/services/brands";
import { Plug } from "@phosphor-icons/react";
import { Loader2 } from "lucide-react";

interface FacebookConnectButtonProps {
    brandId: number;
    onConnect?: () => void;
}

export function FacebookConnectButton({ brandId, onConnect }: FacebookConnectButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { login, api, isInitialized } = useFacebookSDK();

    const handleConnect = async () => {
        try {
            setIsLoading(true);

            // 1. Faz login no Facebook e solicita permissões
            const loginResponse = await login(
                "business_management,ads_management,ads_read"
            );

            if (loginResponse.status !== "connected" || !loginResponse.authResponse?.accessToken) {
                throw new Error("Falha ao conectar com o Facebook");
            }

            // 2. Obtém as contas de anúncio disponíveis
            interface AdAccountResponse {
                account_id: string;
                name: string;
            }

            const accounts = await api<AdAccountResponse[]>("/me/adaccounts");

            if (!accounts?.length) {
                throw new Error("Nenhuma conta de anúncio encontrada");
            }

            // 3. Por enquanto vamos usar a primeira conta encontrada
            const selectedAccount = accounts[0];

            // 4. Conecta a conta ao backend
            await brandsService.connectFacebook(
                brandId,
                loginResponse.authResponse.accessToken,
                selectedAccount.account_id
            );

            toast.success("Marca conectada com sucesso ao Facebook!");

            // 5. Notifica o componente pai para atualizar a lista
            onConnect?.();
        } catch (error) {
            console.error("Erro ao conectar conta:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Erro ao conectar conta do Facebook"
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!isInitialized) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleConnect}
            disabled={isLoading}
            className="gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Plug className="h-4 w-4" />
            )}
            Conectar Facebook
        </Button>
    );
}