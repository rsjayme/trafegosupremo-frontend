import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetAlertsService } from '@/services/budget-alerts';
import type { CreateBudgetAlertDTO, UpdateBudgetAlertDTO } from '@/types/budget-alerts';
import { toast } from 'sonner';

import { UseQueryOptions } from '@tanstack/react-query';
import { BudgetAlert } from '@/types/budget-alerts';

export function useBudgetAlerts(
    brandId: number,
    options?: Omit<UseQueryOptions<BudgetAlert[], Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: ['budget-alerts', brandId],
        queryFn: () => budgetAlertsService.listByBrand(brandId),
        ...options,
    });
}

export function useCreateBudgetAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateBudgetAlertDTO) => budgetAlertsService.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['budget-alerts', variables.brandId] });
            toast.success('Alerta de orçamento criado com sucesso');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useUpdateBudgetAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateBudgetAlertDTO }) =>
            budgetAlertsService.update(id, data),
        onSuccess: () => {
            // Invalidamos todas as queries de alertas
            queryClient.invalidateQueries({
                queryKey: ['budget-alerts'],
            });
            toast.success('Alerta de orçamento atualizado com sucesso');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}

export function useDeleteBudgetAlert() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => budgetAlertsService.delete(id),
        onSuccess: () => {
            // Invalidamos todas as queries de alertas pois não sabemos a marca específica
            queryClient.invalidateQueries({
                queryKey: ['budget-alerts'],
            });
            toast.success('Alerta de orçamento excluído com sucesso');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });
}