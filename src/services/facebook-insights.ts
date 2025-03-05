import api from '@/lib/api';

export interface Action {
    action_type: string;
    value: string;
}

export interface CostPerActionType {
    action_type: string;
    value: string;
}

interface BaseInsight {
    account_id: string;
    campaign_name: string;
    impressions: string;
    clicks: string;
    spend: string;
    ctr: string;
    cpc: string;
    cpm: string;
    reach: string;
    frequency: string;
    actions: Action[];
    cost_per_action_type: CostPerActionType[];
    date_start: string;
    date_stop: string;
}

// Adicionando tipos específicos para cada endpoint, com campos adicionais específicos
export interface InsightsDemographics extends BaseInsight {
    age: string;
    gender: string;
}

// Usando type ao invés de interface para evitar avisos de interface vazia
export type InsightsOverview = BaseInsight;
export type InsightsDaily = BaseInsight;

interface TimelineMetrics {
    impressions: number[];
    clicks: number[];
    spend: number[];
    ctr: number[];
    cpc: number[];
    cpm: number[];
}

interface TimelineData {
    dates: string[];
    metrics: TimelineMetrics;
}

/**
 * Serviço para acessar dados de insights do Facebook
 */
export class FacebookInsightsService {
    /**
     * Busca dados gerais de insights
     */
    async getOverview(brandId: string, since?: string, until?: string) {
        const params = new URLSearchParams();
        if (since) params.append('since', since.split('T')[0]);
        if (until) params.append('until', until.split('T')[0]);

        const url = `/facebook/insights/${brandId}/overview?${params.toString()}`;
        console.log('URL do overview:', url);

        const response = await api.get<InsightsOverview[]>(url);
        console.log('Dados brutos do overview:', JSON.stringify(response.data, null, 2));
        return response.data;
    }

    /**
     * Busca dados diários de insights
     */
    async getDaily(brandId: string, since?: string, until?: string) {
        const params = new URLSearchParams();
        if (since) params.append('since', since.split('T')[0]);
        if (until) params.append('until', until.split('T')[0]);

        const url = `/facebook/insights/${brandId}/daily?${params.toString()}`;
        console.log('URL do daily:', url);

        const response = await api.get<InsightsDaily[]>(url);
        console.log('Dados brutos do daily:', JSON.stringify(response.data, null, 2));
        return response.data;
    }

    /**
     * Busca dados demográficos de insights
     */
    async getDemographics(brandId: string, since?: string, until?: string) {
        const params = new URLSearchParams();
        if (since) params.append('since', since.split('T')[0]);
        if (until) params.append('until', until.split('T')[0]);

        const url = `/facebook/insights/${brandId}/demographics?${params.toString()}`;
        console.log('URL do demographics:', url);

        const response = await api.get<InsightsDemographics[]>(url);
        console.log('Dados brutos do demographics:', JSON.stringify(response.data, null, 2));
        return response.data;
    }

    /**
     * Converte string para número de forma segura
     */
    formatValue(value: string | undefined | null): number {
        if (value === undefined || value === null) {
            console.log('Valor indefinido ou nulo:', value);
            return 0;
        }
        const num = parseFloat(value);
        if (isNaN(num)) {
            console.log('Valor não é um número válido:', value);
            return 0;
        }
        console.log(`Convertendo ${value} para número:`, num);
        return num;
    }

    /**
     * Calcula a porcentagem entre dois valores
     */
    calculatePercentage(value: string, total: string): number {
        const valueNum = this.formatValue(value);
        const totalNum = this.formatValue(total);
        return totalNum === 0 ? 0 : (valueNum / totalNum) * 100;
    }

    /**
     * Agrupa dados por idade
     */
    groupByAge(data: InsightsDemographics[]): Record<string, number> {
        console.log('Analisando dados demográficos (idade):', JSON.stringify(data, null, 2));
        const ageGroups: Record<string, number> = {};

        data.forEach(item => {
            console.log('Processando item de idade:', item);
            if (item?.impressions) {
                const impressions = this.formatValue(item.impressions);
                console.log(`Idade ${item.age}, impressões:`, impressions);
                if (item.age) {
                    if (ageGroups[item.age]) {
                        ageGroups[item.age] += impressions;
                    } else {
                        ageGroups[item.age] = impressions;
                    }
                }
            }
        });

        console.log('Grupos por idade finalizados:', ageGroups);
        return ageGroups;
    }

    /**
     * Agrupa dados por gênero
     */
    groupByGender(data: InsightsDemographics[]): Record<string, number> {
        console.log('Analisando dados demográficos (gênero):', JSON.stringify(data, null, 2));
        const genderGroups: Record<string, number> = {};

        data.forEach(item => {
            console.log('Processando item de gênero:', item);
            if (item?.impressions) {
                const impressions = this.formatValue(item.impressions);
                console.log(`Gênero ${item.gender}, impressões:`, impressions);
                if (item.gender) {
                    if (genderGroups[item.gender]) {
                        genderGroups[item.gender] += impressions;
                    } else {
                        genderGroups[item.gender] = impressions;
                    }
                }
            }
        });

        console.log('Grupos por gênero finalizados:', genderGroups);
        return genderGroups;
    }

    /**
     * Formata dados para série temporal
     */
    formatTimelineData(data: InsightsDaily[]): TimelineData {
        console.log('Formatando dados de timeline:', JSON.stringify(data, null, 2));

        const result: TimelineData = {
            dates: [],
            metrics: {
                impressions: [],
                clicks: [],
                spend: [],
                ctr: [],
                cpc: [],
                cpm: []
            }
        };

        if (!data?.length) {
            console.log('Sem dados para formatar');
            return result;
        }

        data.sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())
            .forEach(item => {
                result.dates.push(item.date_start);
                result.metrics.impressions.push(this.formatValue(item.impressions));
                result.metrics.clicks.push(this.formatValue(item.clicks));
                result.metrics.spend.push(this.formatValue(item.spend));
                result.metrics.ctr.push(this.formatValue(item.ctr));
                result.metrics.cpc.push(this.formatValue(item.cpc));
                result.metrics.cpm.push(this.formatValue(item.cpm));
            });

        console.log('Dados de timeline formatados:', result);
        return result;
    }
}