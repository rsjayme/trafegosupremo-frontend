import { useMemo } from 'react';
import type { DashboardData, InsightMetrics, DailyInsights } from '@/types/dashboard';

export type ComparisonResult = {
    percentage: number;
    trend: 'up' | 'down' | 'neutral';
};

export function useDashboardComparison(current?: DashboardData, previous?: DashboardData) {
    return useMemo(() => {
        if (!current || !previous) {
            return null;
        }

        const compareMetrics = (current: InsightMetrics, previous: InsightMetrics): Record<string, ComparisonResult> => {
            const results: Record<string, ComparisonResult> = {};

            // Comparar métricas básicas
            const metrics: (keyof InsightMetrics)[] = ['impressions', 'reach', 'clicks', 'spend', 'cpc', 'ctr', 'cpm'];
            metrics.forEach(metric => {
                const currentValue = current[metric];
                const previousValue = previous[metric];

                if (typeof currentValue === 'number' && typeof previousValue === 'number' && previousValue !== 0) {
                    const percentage = ((currentValue - previousValue) / previousValue) * 100;
                    results[metric] = {
                        percentage,
                        trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral'
                    };
                }
            });

            // Comparar ações
            const currentActions = current.actions.reduce((sum, action) => sum + action.value, 0);
            const previousActions = previous.actions.reduce((sum, action) => sum + action.value, 0);

            if (previousActions !== 0) {
                const percentage = ((currentActions - previousActions) / previousActions) * 100;
                results.actions = {
                    percentage,
                    trend: percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral'
                };
            }

            return results;
        };

        const compareDailyData = (current: DailyInsights[], previous: DailyInsights[]): Record<string, ComparisonResult>[] => {
            const maxLength = Math.min(current.length, previous.length);
            const results: Record<string, ComparisonResult>[] = [];

            for (let i = 0; i < maxLength; i++) {
                results.push(compareMetrics(current[i].metrics, previous[i].metrics));
            }

            return results;
        };

        // Comparar métricas gerais
        const overviewComparison = compareMetrics(current.overview, previous.overview);

        // Comparar métricas diárias
        const dailyComparison = compareDailyData(current.daily, previous.daily);

        // Calcular médias e totais
        const totals = {
            current: {
                spend: current.daily.reduce((sum, day) => sum + day.metrics.spend, 0),
                actions: current.daily.reduce((sum, day) =>
                    sum + day.metrics.actions.reduce((total, action) => total + action.value, 0), 0
                ),
                clicks: current.daily.reduce((sum, day) => sum + day.metrics.clicks, 0)
            },
            previous: {
                spend: previous.daily.reduce((sum, day) => sum + day.metrics.spend, 0),
                actions: previous.daily.reduce((sum, day) =>
                    sum + day.metrics.actions.reduce((total, action) => total + action.value, 0), 0
                ),
                clicks: previous.daily.reduce((sum, day) => sum + day.metrics.clicks, 0)
            }
        };

        // Calcular ROI e métricas derivadas
        const derived = {
            cpa: {
                current: totals.current.spend / totals.current.actions,
                previous: totals.previous.spend / totals.previous.actions
            },
            cpc: {
                current: totals.current.spend / totals.current.clicks,
                previous: totals.previous.spend / totals.previous.clicks
            }
        };

        return {
            overview: overviewComparison,
            daily: dailyComparison,
            totals,
            derived
        };
    }, [current, previous]);
}