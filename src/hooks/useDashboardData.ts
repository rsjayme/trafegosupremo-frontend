import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboard';
import type { DashboardData, DashboardFilters } from '@/types/dashboard';

const dashboardService = new DashboardService();

export function useDashboardData(filters: DashboardFilters, options: { enabled?: boolean } = {}) {
    const enabled = options.enabled !== false;

    // Query principal para os dados do dashboard
    const dashboardQuery = useQuery({
        queryKey: ['dashboard', filters],
        queryFn: () => dashboardService.getDashboardData(filters),
        staleTime: 15 * 60 * 1000, // 15 minutos conforme TTL da API
        refetchInterval: 5 * 60 * 1000, // Atualizar a cada 5 minutos
        enabled,
        retry: (failureCount: number, error: Error) => {
            if (error.message.includes('Token do Facebook expirado') ||
                error.message.includes('Permissão negada')) {
                return false; // Não tentar novamente para erros de autenticação
            }
            return failureCount < 3;
        }
    });

    // Query para dados do período de comparação
    const comparisonQuery = useQuery({
        queryKey: ['dashboard-comparison', filters],
        queryFn: () => dashboardService.getComparisonData(filters),
        staleTime: 15 * 60 * 1000,
        enabled: enabled && !!filters.comparison && !dashboardQuery.isError,
        retry: (failureCount: number, error: Error) => {
            if (error.message.includes('Token do Facebook expirado') ||
                error.message.includes('Permissão negada')) {
                return false;
            }
            return failureCount < 3;
        }
    });

    // Consolidar dados atuais e de comparação
    const data: { current: DashboardData; previous?: DashboardData } | undefined =
        dashboardQuery.data ? {
            current: dashboardQuery.data,
            previous: filters.comparison ? comparisonQuery.data : undefined
        } : undefined;

    return {
        data,
        isLoading: dashboardQuery.isLoading || (filters.comparison && comparisonQuery.isLoading),
        isError: dashboardQuery.isError || (filters.comparison && comparisonQuery.isError),
        error: dashboardQuery.error || comparisonQuery.error,
        refetch: async () => {
            await dashboardQuery.refetch();
            if (filters.comparison) {
                await comparisonQuery.refetch();
            }
        }
    };
}