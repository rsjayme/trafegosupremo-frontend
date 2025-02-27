"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FacebookLogo } from '@phosphor-icons/react';
import { toast } from 'sonner';

interface FacebookLoginResponse {
    authResponse: {
        accessToken: string;
        userID: string;
        expiresIn: number;
        signedRequest: string;
    } | null;
    status: 'connected' | 'not_authorized' | 'unknown';
}

interface FacebookAdAccount {
    id: string;
    name: string;
    account_id: string;
}

interface FacebookApiResponse {
    data: FacebookAdAccount[];
    paging: {
        cursors: {
            before: string;
            after: string;
        };
    };
}

declare global {
    interface Window {
        FB: {
            init: (params: { appId: string; version: string; cookie: boolean }) => void;
            login: (callback: (response: FacebookLoginResponse) => void, params: { scope: string }) => void;
            api: (path: string, callback: (response: FacebookApiResponse) => void) => void;
        };
    }
}

interface FacebookConnectProps {
    brandId: number;
    onConnect: (data: { accessToken: string; accountId: string }) => Promise<void>;
}

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

export function FacebookConnect({ onConnect }: FacebookConnectProps) {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!FACEBOOK_APP_ID) {
            console.error('Facebook App ID não configurado');
            return;
        }

        // Carrega o SDK do Facebook
        const script = document.createElement('script');
        script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.FB.init({
                appId: FACEBOOK_APP_ID,
                version: 'v18.0',
                cookie: true,
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleFacebookLogin = () => {
        if (!FACEBOOK_APP_ID) {
            toast.error('Configuração do Facebook incompleta');
            return;
        }

        setIsLoading(true);

        window.FB.login(
            async (loginResponse) => {
                if (loginResponse.authResponse) {
                    const { accessToken } = loginResponse.authResponse;

                    // Busca as contas de anúncios do usuário
                    window.FB.api(
                        '/me/adaccounts',
                        async (accountsResponse) => {
                            if (accountsResponse && accountsResponse.data && accountsResponse.data.length > 0) {
                                const account = accountsResponse.data[0];
                                try {
                                    await onConnect({
                                        accessToken,
                                        accountId: account.id.replace('act_', '')
                                    });
                                } catch (error) {
                                    toast.error(error instanceof Error ? error.message : 'Erro ao conectar conta');
                                }
                            } else {
                                toast.error('Nenhuma conta de anúncios encontrada');
                            }
                            setIsLoading(false);
                        }
                    );
                } else {
                    toast.error('Login cancelado ou falhou');
                    setIsLoading(false);
                }
            },
            {
                scope: 'ads_management,ads_read,read_insights'
            }
        );
    };

    return (
        <Card className="p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold">Conectar com Facebook</h3>
            <p className="text-muted-foreground">
                Conecte sua marca a uma conta de anúncios do Facebook para gerenciar suas campanhas.
            </p>
            <Button
                onClick={handleFacebookLogin}
                disabled={isLoading || !FACEBOOK_APP_ID}
                className="w-full sm:w-auto"
            >
                <FacebookLogo className="h-5 w-5 mr-2" weight="fill" />
                {isLoading ? 'Conectando...' : 'Conectar com Facebook'}
            </Button>
            {!FACEBOOK_APP_ID && (
                <p className="text-sm text-red-500">
                    Configuração do Facebook incompleta. Contate o suporte.
                </p>
            )}
        </Card>
    );
}