import api from '@/lib/api';
import type {
    DashboardData,
    DashboardFilters,
    InsightMetrics,
    RawInsightMetrics,
    DailyInsights
} from '@/types/dashboard';

export class DashboardService {
    // Busca todas as métricas necessárias para o dashboard
    async getDashboardData(filters: DashboardFilters): Promise<DashboardData> {
        const { data } = await api.get<RawInsightMetrics[]>(
            `/facebook/insights/${filters.brandId}/overview`,
            { params: { since: filters.since, until: filters.until } }
        );

        // Agrupa dados por data
        const dailyMetrics = this.groupByDate(data);

        return {
            overview: this.calculateOverview(data),
            daily: dailyMetrics,
            demographics: [], // Não disponível no momento
            locations: [], // Não disponível no momento
            devices: [] // Não disponível no momento
        };
    }

    private groupByDate(data: RawInsightMetrics[]): DailyInsights[] {
        // Agrupa os dados por data
        const groupedByDate = data.reduce<{ [date: string]: RawInsightMetrics[] }>((acc, metric) => {
            const date = metric.date_start;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(metric);
            return acc;
        }, {});

        // Converte os dados agrupados em métricas diárias
        return Object.entries(groupedByDate)
            .map(([date, metrics]): DailyInsights => ({
                date,
                metrics: this.calculateOverview(metrics)
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    private calculateOverview(data: RawInsightMetrics[]): InsightMetrics {
        if (data.length === 0) {
            return {
                impressions: 0,
                reach: 0,
                clicks: 0,
                spend: 0,
                cpc: 0,
                ctr: 0,
                cpm: 0,
                frequency: 0,
                actions: []
            };
        }

        return {
            impressions: data.reduce((sum, item) => sum + Number(item.impressions), 0),
            reach: data.reduce((sum, item) => sum + Number(item.reach), 0),
            clicks: data.reduce((sum, item) => sum + Number(item.clicks), 0),
            spend: data.reduce((sum, item) => sum + Number(item.spend), 0),
            cpc: data.reduce((sum, item) => sum + Number(item.cpc), 0) / data.length,
            ctr: data.reduce((sum, item) => sum + Number(item.ctr), 0) / data.length,
            cpm: data.reduce((sum, item) => sum + Number(item.cpm), 0) / data.length,
            frequency: data.reduce((sum, item) => sum + Number(item.frequency), 0) / data.length,
            actions: data.reduce((allActions, item) => {
                item.actions.forEach(action => {
                    const existing = allActions.find(a => a.action_type === action.action_type);
                    if (existing) {
                        existing.value += Number(action.value);
                    } else {
                        allActions.push({ ...action, value: Number(action.value) });
                    }
                });
                return allActions;
            }, [] as InsightMetrics['actions'])
        };
    }

    // Busca dados para comparação de períodos
    async getComparisonData(filters: DashboardFilters): Promise<DashboardData> {
        const daysInRange = this.calculateDateRangeDays(filters.since, filters.until);

        const previousFilters = {
            ...filters,
            since: this.subtractDays(filters.since, daysInRange),
            until: this.subtractDays(filters.until, daysInRange)
        };

        return this.getDashboardData(previousFilters);
    }

    private calculateDateRangeDays(since: string, until: string): number {
        const start = new Date(since);
        const end = new Date(until);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }

    private subtractDays(date: string, days: number): string {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - days);
        return newDate.toISOString().split('T')[0];
    }
}