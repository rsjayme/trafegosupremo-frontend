import { useState, useCallback, useEffect } from 'react';
import { useFacebook } from '@/contexts/FacebookContext';
import { Campaign, CampaignMetrics } from '@/services/facebook';

interface UseFacebookDataProps {
    autoLoad?: boolean;
    accountId?: string;
    dateRange?: {
        since: string;
        until: string;
    };
}

interface MetricsMap {
    [campaignId: string]: CampaignMetrics[];
}

export function useFacebookData({ autoLoad = true, accountId, dateRange }: UseFacebookDataProps = {}) {
    const {
        campaigns,
        metrics,
        isLoading,
        error,
        loadCampaigns,
        loadMetrics,
        syncData
    } = useFacebook();

    const [selectedCampaigns, setSelectedCampaigns] = useState<Campaign[]>([]);
    const [campaignMetrics, setCampaignMetrics] = useState<MetricsMap>({});
    const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

    // Carrega campanhas iniciais
    useEffect(() => {
        if (autoLoad) {
            const loadData = async () => {
                try {
                    if (accountId) {
                        await loadCampaigns();
                    }
                } catch (error) {
                    console.error('Erro ao carregar campanhas:', error);
                }
            };
            loadData();
        }
    }, [autoLoad, accountId, loadCampaigns]);

    // Função para carregar métricas das campanhas selecionadas
    const loadSelectedMetrics = useCallback(async () => {
        if (!dateRange) return;

        setIsLoadingMetrics(true);
        const metricsPromises = selectedCampaigns.map(campaign =>
            loadMetrics(campaign.id, dateRange.since, dateRange.until)
        );

        try {
            await Promise.all(metricsPromises);
            setCampaignMetrics(metrics);
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
        } finally {
            setIsLoadingMetrics(false);
        }
    }, [selectedCampaigns, dateRange, loadMetrics, metrics]);

    // Atualiza métricas quando campanhas selecionadas ou período mudam
    useEffect(() => {
        if (selectedCampaigns.length > 0 && dateRange) {
            loadSelectedMetrics();
        }
    }, [selectedCampaigns, dateRange, loadSelectedMetrics]);

    // Handler para seleção de campanhas
    const handleSelectCampaigns = useCallback((campaigns: Campaign[]) => {
        setSelectedCampaigns(campaigns);
    }, []);

    // Função para forçar sincronização e recarregamento
    const refreshData = useCallback(async () => {
        try {
            await syncData();
            if (accountId) {
                await loadCampaigns();
            }
            if (selectedCampaigns.length > 0 && dateRange) {
                await loadSelectedMetrics();
            }
        } catch (error) {
            console.error('Erro ao atualizar dados:', error);
            throw error;
        }
    }, [syncData, accountId, loadCampaigns, selectedCampaigns, dateRange, loadSelectedMetrics]);

    // Calcula totais das métricas selecionadas
    const calculateTotals = useCallback(() => {
        if (!selectedCampaigns.length) return null;

        return selectedCampaigns.reduce((totals, campaign) => {
            const campaignMetrics = metrics[campaign.id] || [];
            campaignMetrics.forEach(metric => {
                totals.impressions = (totals.impressions || 0) + metric.impressions;
                totals.clicks = (totals.clicks || 0) + metric.clicks;
                totals.spend = (totals.spend || 0) + metric.spend;
                totals.reach = (totals.reach || 0) + metric.reach;
            });
            return totals;
        }, {} as Partial<CampaignMetrics>);
    }, [selectedCampaigns, metrics]);

    return {
        campaigns,
        selectedCampaigns,
        metrics: campaignMetrics,
        totals: calculateTotals(),
        isLoading: isLoading || isLoadingMetrics,
        error,
        selectCampaigns: handleSelectCampaigns,
        refreshData,
        loadMetrics: loadSelectedMetrics
    };
}