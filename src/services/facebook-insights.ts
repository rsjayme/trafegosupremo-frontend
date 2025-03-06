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

export interface InsightsDemographics extends BaseInsight {
    age: string;
    gender: string;
}

export interface InsightsDevices extends BaseInsight {
    device_platform: string;
}

export interface InsightsLocations extends BaseInsight {
    country: string;
    region: string;
}

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

export class FacebookInsightsService {
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

    async getDevices(brandId: string, since?: string, until?: string) {
        const params = new URLSearchParams();
        if (since) params.append('since', since.split('T')[0]);
        if (until) params.append('until', until.split('T')[0]);

        const url = `/facebook/insights/${brandId}/devices?${params.toString()}`;
        console.log('URL do devices:', url);

        const response = await api.get<InsightsDevices[]>(url);
        console.log('Dados brutos do devices:', JSON.stringify(response.data, null, 2));
        return response.data;
    }

    async getLocations(brandId: string, since?: string, until?: string) {
        const params = new URLSearchParams();
        if (since) params.append('since', since.split('T')[0]);
        if (until) params.append('until', until.split('T')[0]);

        const url = `/facebook/insights/${brandId}/locations?${params.toString()}`;
        console.log('URL do locations:', url);

        const response = await api.get<InsightsLocations[]>(url);
        console.log('Dados brutos do locations:', JSON.stringify(response.data, null, 2));
        return response.data;
    }

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

    getMetricValue(item: BaseInsight, metric: string): number {
        switch (metric) {
            case 'impressions':
                return this.formatValue(item.impressions);
            case 'clicks':
                return this.formatValue(item.clicks);
            case 'spend':
                return this.formatValue(item.spend);
            case 'reach':
                return this.formatValue(item.reach);
            default:
                return this.formatValue(item.impressions);
        }
    }

    groupByAge(data: InsightsDemographics[], metric: string = 'impressions'): Record<string, number> {
        console.log(`Analisando dados demográficos (idade) para métrica ${metric}:`, data);
        const ageGroups: Record<string, number> = {};

        data.forEach(item => {
            if (item.age) {
                const value = this.getMetricValue(item, metric);
                if (ageGroups[item.age]) {
                    ageGroups[item.age] += value;
                } else {
                    ageGroups[item.age] = value;
                }
            }
        });

        console.log('Grupos por idade finalizados:', ageGroups);
        return ageGroups;
    }

    groupByDevice(data: InsightsDevices[], metric: string = 'impressions'): Record<string, number> {
        console.log(`Analisando dados de dispositivos para métrica ${metric}:`, data);
        const deviceGroups: Record<string, number> = {};

        data.forEach(item => {
            if (item.device_platform) {
                const value = this.getMetricValue(item, metric);
                if (deviceGroups[item.device_platform]) {
                    deviceGroups[item.device_platform] += value;
                } else {
                    deviceGroups[item.device_platform] = value;
                }
            }
        });

        console.log('Grupos por dispositivo finalizados:', deviceGroups);
        return deviceGroups;
    }

    groupByRegion(data: InsightsLocations[], metric: string = 'impressions'): Record<string, number> {
        console.log(`Analisando dados de localização para métrica ${metric}:`, data);
        const regionGroups: Record<string, number> = {};

        data.forEach(item => {
            if (item.region) {
                const value = this.getMetricValue(item, metric);
                if (regionGroups[item.region]) {
                    regionGroups[item.region] += value;
                } else {
                    regionGroups[item.region] = value;
                }
            }
        });

        console.log('Grupos por região finalizados:', regionGroups);
        return regionGroups;
    }

    groupByGender(data: InsightsDemographics[], metric: string = 'impressions'): Record<string, number> {
        console.log(`Analisando dados demográficos (gênero) para métrica ${metric}:`, data);
        const genderGroups: Record<string, number> = {};

        data.forEach(item => {
            if (item.gender) {
                const value = this.getMetricValue(item, metric);
                if (genderGroups[item.gender]) {
                    genderGroups[item.gender] += value;
                } else {
                    genderGroups[item.gender] = value;
                }
            }
        });

        console.log('Grupos por gênero finalizados:', genderGroups);
        return genderGroups;
    }

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