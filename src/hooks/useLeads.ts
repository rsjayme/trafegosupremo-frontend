import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leadsService } from '@/services/leads';
import type { LeadFormData, APILead } from '@/lib/types/lead';

// Converte dados do form para o formato da API
const convertToApiFormat = (data: Partial<LeadFormData>): Partial<APILead> => ({
    ...data,
    lastContactDate: data.lastContactDate?.toISOString() ?? null,
    nextContactDate: data.nextContactDate?.toISOString() ?? null,
});

export function useLeads() {
    const queryClient = useQueryClient();

    const { data: kanban, isLoading } = useQuery({
        queryKey: ['leads', 'kanban'],
        queryFn: leadsService.getKanban
    });

    const createMutation = useMutation({
        mutationFn: (data: LeadFormData) =>
            leadsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead criado com sucesso');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    type UpdateParams = {
        id: number;
        data: Partial<APILead>;
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: UpdateParams) =>
            leadsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead atualizado com sucesso');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: leadsService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead removido com sucesso');
        },
        onError: (error: Error) => {
            toast.error(error.message);
        }
    });

    return {
        kanban,
        isLoading,
        createLead: createMutation.mutate,
        updateLead: updateMutation.mutate,
        deleteLead: deleteMutation.mutate,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
}