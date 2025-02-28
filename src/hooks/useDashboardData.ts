import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboard';
import type { DashboardFilters, DashboardData } from '@/types/dashboard';

export function useDashboardData(filters: DashboardFilters, options?: { enabled?: boolean }) {
    const dashboardService = new DashboardService();

    return useQuery<DashboardData, Error>({
        queryKey: ['dashboard', filters],
        queryFn: () => dashboardService.getDashboardData(filters),
        enabled: options?.enabled
    });
}