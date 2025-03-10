import api from '@/lib/api';
import type { METRIC_CATEGORIES } from '@/components/ReportsCanvas/metric-categories';

// Define o tipo MetricKey baseado na nova estrutura de categorias
type AllMetricKeys = {
    [K in keyof typeof METRIC_CATEGORIES]: keyof (typeof METRIC_CATEGORIES)[K]['metrics']
}[keyof typeof METRIC_CATEGORIES];

export interface AnalysisRequest {
    brandId: number;
    campaignId: string;
    since: string;
    until: string;
}

interface Demographics {
    age: Record<string, number>;
    gender: Record<string, number>;
    location: Record<string, number>;
}

interface DailyMetrics {
    dates: string[];
    metrics: {
        [key in AllMetricKeys]?: number[];
    };
}

export interface AnalysisResponse {
    analysis: string;
    metrics: {
        overview: {
            impressions: number;
            clicks: number;
            spend: number;
            ctr: number;
            cpc: number;
            cpm: number;
            results?: number;
        };
        demographics: Demographics;
        daily: DailyMetrics;
        locations: Record<string, number>;
    };
}

const aiAnalysisService = {
    analyzeCampaign: async (request: AnalysisRequest): Promise<AnalysisResponse> => {
        // Garante que o campaignId é uma string
        const payload = {
            ...request,
            campaignId: String(request.campaignId)
        };

        console.log('Enviando requisição de análise:', payload);

        const response = await api.post<AnalysisResponse>('/analysis/campaign', payload);
        return response.data;
    }
};

export { aiAnalysisService };