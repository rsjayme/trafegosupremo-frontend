import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { leadsService } from '@/services/leads';
import type { LeadFormData, LeadUpdate, KanbanResponse } from '@/lib/types/lead';

const METADATA_FIELDS = ['id', 'createdAt', 'updatedAt'] as const;

const cleanUpdateData = (data: Record<string, unknown>) => {
    const cleaned = { ...data };

    METADATA_FIELDS.forEach(field => {
        delete cleaned[field];
    });

    return cleaned as Partial<LeadFormData>;
};

export function useLeads() {
    const queryClient = useQueryClient();

    const { data: kanban, isLoading } = useQuery<KanbanResponse>({
        queryKey: ['leads', 'kanban'],
        queryFn: leadsService.getKanban
    });

    const createMutation = useMutation({
        mutationFn: (data: LeadFormData) => leadsService.create(data),
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
        data: LeadUpdate;
        showToast?: boolean;
    };

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: UpdateParams) => {
            const cleanedData = cleanUpdateData(data);
            return leadsService.update(id, cleanedData);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            if (variables.showToast) {
                toast.success('Lead atualizado com sucesso');
            }
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