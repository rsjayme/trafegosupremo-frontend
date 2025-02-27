"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { facebookService, type Campaign, type FacebookAccount, type CampaignMetrics } from "@/services/facebook";

interface FacebookContextType {
    accounts: FacebookAccount[];
    campaigns: Campaign[];
    metrics: Record<string, CampaignMetrics[]>;
    isLoading: boolean;
    error: string | null;
    connectAccount: (accessToken: string, accountId: string) => Promise<void>;
    loadCampaigns: () => Promise<void>;
    loadMetrics: (campaignId: string, since: string, until: string) => Promise<void>;
    syncData: () => Promise<void>;
    clearCache: () => void;
}

const FacebookContext = createContext<FacebookContextType | undefined>(undefined);

export function FacebookProvider({ children }: { children: React.ReactNode }) {
    const [accounts, setAccounts] = useState<FacebookAccount[]>([]);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [metrics, setMetrics] = useState<Record<string, CampaignMetrics[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConnectAccount = async (accessToken: string, accountId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const account = await facebookService.connectAccount({ accessToken, accountId });
            setAccounts(prev => [...prev, account]);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao conectar conta');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadCampaigns = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await facebookService.getCampaigns();
            setCampaigns(data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao carregar campanhas');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMetrics = async (campaignId: string, since: string, until: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await facebookService.getCampaignMetrics(campaignId, { since, until });
            setMetrics(prev => ({
                ...prev,
                [campaignId]: data
            }));
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao carregar métricas');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            await facebookService.syncData();
            // Recarrega os dados após sincronização
            await handleLoadCampaigns();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Erro ao sincronizar dados');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleClearCache = useCallback(() => {
        facebookService.clearCache();
        setCampaigns([]);
        setMetrics({});
    }, []);

    return (
        <FacebookContext.Provider
            value={{
                accounts,
                campaigns,
                metrics,
                isLoading,
                error,
                connectAccount: handleConnectAccount,
                loadCampaigns: handleLoadCampaigns,
                loadMetrics: handleLoadMetrics,
                syncData: handleSyncData,
                clearCache: handleClearCache
            }}
        >
            {children}
        </FacebookContext.Provider>
    );
}

export function useFacebook() {
    const context = useContext(FacebookContext);
    if (context === undefined) {
        throw new Error("useFacebook must be used within a FacebookProvider");
    }
    return context;
}