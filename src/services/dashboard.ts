import api from '@/lib/api';
import type {
    DashboardFilters,
    FacebookCampaignMetrics,
    AggregatedMetrics
} from '@/types/dashboard';

export class DashboardService {
    /**
     * Fetches dashboard data from the Facebook insights API
     * @param filters - Filters including brandId, date range and comparison flag
     * @returns Promise with current and optional previous period data
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getDashboardData(filters: DashboardFilters): Promise<any> {
        if (!filters.accountId) {
            throw new Error('accountId é necessário para buscar métricas');
        }

        const { data } = await api.get<FacebookCampaignMetrics[]>(
            `/facebook/insights/${filters.brandId}/overview`,
            {
                params: {
                    since: filters.since,
                    until: filters.until
                }
            }
        );

        // Se estiver em modo de comparação, busca dados do período anterior
        if (filters.comparison) {
            const daysInRange = this.calculateDateRangeDays(filters.since, filters.until);
            const previousFilters = {
                ...filters,
                since: this.subtractDays(filters.since, daysInRange),
                until: this.subtractDays(filters.until, daysInRange)
            };

            const { data: previousData } = await api.get<FacebookCampaignMetrics[]>(
                `/facebook/insights`,
                {
                    params: {
                        accountId: filters.accountId,
                        since: previousFilters.since,
                        until: previousFilters.until
                    }
                }
            );

            return {
                current: data,
                previous: previousData
            };
        }

        return { current: data };
    }

    /**
     * Calculates aggregated metrics from an array of campaign data
     * @param campaigns - Array of campaign metrics from Facebook
     * @returns Aggregated metrics including totals and averages
     */
    calculateAggregatedMetrics(campaigns: FacebookCampaignMetrics[]): AggregatedMetrics {
        const total = {
            impressions: 0,
            reach: 0,
            clicks: 0,
            spend: 0,
            ctr: 0,
            cpc: 0,
            cpm: 0,
            frequency: 0
        };

        // Calcula totais para métricas básicas
        campaigns.forEach(campaign => {
            total.impressions += Number(campaign.impressions);
            total.reach += Number(campaign.reach);
            total.clicks += Number(campaign.clicks);
            total.spend += Number(campaign.spend);
            total.ctr += Number(campaign.ctr);
            total.cpc += Number(campaign.cpc);
            total.cpm += Number(campaign.cpm);
            total.frequency += Number(campaign.frequency);
        });

        // Calcula médias para métricas de taxa
        if (campaigns.length > 0) {
            total.ctr /= campaigns.length;
            total.cpc /= campaigns.length;
            total.cpm /= campaigns.length;
            total.frequency /= campaigns.length;
        }

        // Agrega ações
        const actionsMap = new Map<string, { value: number; cost: number }>();

        campaigns.forEach(campaign => {
            campaign.actions.forEach(action => {
                const current = actionsMap.get(action.action_type) || { value: 0, cost: 0 };
                const cost = campaign.cost_per_action_type.find(
                    c => c.action_type === action.action_type
                )?.value || "0";

                actionsMap.set(action.action_type, {
                    value: current.value + Number(action.value),
                    cost: Number(cost)
                });
            });
        });

        const actions = Array.from(actionsMap.entries()).map(([type, data]) => ({
            type,
            value: data.value,
            cost: data.cost
        }));

        return {
            ...total,
            actions
        };
    }

    /**
     * Calculates the number of days between two dates
     * @param since - Start date in ISO format
     * @param until - End date in ISO format
     * @returns Number of days between dates
     */
    private calculateDateRangeDays(since: string, until: string): number {
        const start = new Date(since);
        const end = new Date(until);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }

    /**
     * Subtracts a number of days from a date
     * @param date - Date in ISO format
     * @param days - Number of days to subtract
     * @returns New date in ISO format
     */
    private subtractDays(date: string, days: number): string {
        const newDate = new Date(date);
        newDate.setDate(newDate.getDate() - days);
        return newDate.toISOString().split('T')[0];
    }
}