import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leadsService } from '@/services/leads';
import type { LeadFormData } from '@/lib/types/lead';

export function useLeads() {
    const queryClient = useQueryClient();

    const { data: kanban, isLoading } = useQuery({
        queryKey: ['leads', 'kanban'],
        queryFn: leadsService.getKanban
    });

    const createMutation = useMutation({
        mutationFn: (data: LeadFormData) => {
            return leadsService.create(data);
        },
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
        data: Partial<LeadFormData>;
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: UpdateParams) => {
            return leadsService.update(id, data);
        },
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