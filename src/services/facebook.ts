import api from '@/lib/api';

export interface FacebookAccount {
    id: number;
    accountId: string;
    name: string;
    status: string;
}

export interface FacebookAdAccount {
    id: string;
    account_id: string;
    name: string;
    business: {
        id: string | null;
    }
}

export interface ConnectAdAccountDto {
    accountId: string;
    accountName: string;
    businessId?: string;
}

export interface Campaign {
    id: string;
    name: string;
    status: string;
    objective: string;
    daily_budget: number;
    lifetime_budget: number;
    start_time: string;
    end_time: string;
}

export interface CampaignMetrics {
    date: string;
    impressions: number;
    clicks: number;
    spend: number;
    reach: number;
}

export interface ConnectAccountData {
    accessToken: string;
    accountId: string;
}

export interface MetricsQuery {
    since: string;
    until: string;
}

const CACHE_TTL = {
    CAMPAIGNS: 5 * 60 * 1000, // 5 minutos
    METRICS: 15 * 60 * 1000, // 15 minutos
    ACCOUNT: 60 * 60 * 1000, // 1 hora
};

class FacebookService {
    private campaignsCache: Map<string, { data: Campaign[]; timestamp: number }> = new Map();
    private metricsCache: Map<string, { data: CampaignMetrics[]; timestamp: number }> = new Map();

    async connectAccount(data: ConnectAccountData): Promise<FacebookAccount> {
        const response = await api.post<FacebookAccount>('/facebook/accounts', data);
        return response.data;
    }

    async getCampaigns(): Promise<Campaign[]> {
        const cacheKey = 'all-campaigns';
        const cachedData = this.campaignsCache.get(cacheKey);

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL.CAMPAIGNS) {
            return cachedData.data;
        }

        const response = await api.get<Campaign[]>('/facebook/campaigns');
        this.campaignsCache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
        });

        return response.data;
    }

    async getCampaignMetrics(campaignId: string, query: MetricsQuery): Promise<CampaignMetrics[]> {
        const cacheKey = `metrics-${campaignId}-${query.since}-${query.until}`;
        const cachedData = this.metricsCache.get(cacheKey);

        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL.METRICS) {
            return cachedData.data;
        }

        const response = await api.get<CampaignMetrics[]>(`/facebook/campaigns/${campaignId}/metrics`, {
            params: query,
        });

        this.metricsCache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
        });

        return response.data;
    }

    async syncData(): Promise<void> {
        await api.post('/facebook/sync');
        // Limpa o cache após sincronização
        this.campaignsCache.clear();
        this.metricsCache.clear();
    }

    // Utilitários para gerenciamento de cache
    clearCache(): void {
        this.campaignsCache.clear();
        this.metricsCache.clear();
    }

    clearCampaignsCache(): void {
        this.campaignsCache.clear();
    }

    clearMetricsCache(): void {
        this.metricsCache.clear();
    }

    async getAvailableAdAccounts(): Promise<FacebookAdAccount[]> {
        const response = await api.get<FacebookAdAccount[]>('/facebook/available-ad-accounts');
        return response.data;
    }

    async getBrandAdAccounts(brandId: number): Promise<FacebookAdAccount[]> {
        const response = await api.get<FacebookAdAccount[]>(`/facebook/brands/${brandId}/ad-accounts`);
        return response.data;
    }

    async connectAdAccount(brandId: number, data: ConnectAdAccountDto): Promise<FacebookAdAccount> {
        const response = await api.post<FacebookAdAccount>(`/facebook/brands/${brandId}/ad-accounts`, data);
        return response.data;
    }
}

export const facebookService = new FacebookService();