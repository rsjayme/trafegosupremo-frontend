import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientsService, type FilterClientsParams } from '@/services/clients';
import { type ClientData } from '@/lib/schemas/client';

interface UseClientsResult {
    clients: ClientData[];
    isLoading: boolean;
    error: Error | null;
    createClient: {
        mutateAsync: (data: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
        isPending: boolean;
    };
    updateClient: {
        mutateAsync: (params: { id: number; data: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'> }) => Promise<void>;
        isPending: boolean;
    };
    updateClientStatus: {
        mutate: (params: { id: number; status: 'ATIVO' | 'INATIVO' }) => void;
        isPending: boolean;
    };
}

export function useClients(params: FilterClientsParams = {}): UseClientsResult {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['clients', params],
        queryFn: () => clientsService.list(params),
    });

    const createClient = useMutation({
        mutationFn: async (data: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'>) => {
            await clientsService.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast.success('Cliente criado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao criar cliente');
        },
    });

    const updateClient = useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'> }) => {
            await clientsService.update(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast.success('Cliente atualizado com sucesso!');
        },
        onError: () => {
            toast.error('Erro ao atualizar cliente');
        },
    });

    const updateClientStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: 'ATIVO' | 'INATIVO' }) => {
            return clientsService.update(id, { status });
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            toast.success(
                `Cliente ${variables.status === 'ATIVO' ? 'ativado' : 'inativado'} com sucesso!`
            );
        },
        onError: () => {
            toast.error('Erro ao atualizar status do cliente');
        },
    });

    return {
        clients: data?.data ?? [],
        isLoading,
        error: error as Error | null,
        createClient: {
            mutateAsync: createClient.mutateAsync,
            isPending: createClient.isPending,
        },
        updateClient: {
            mutateAsync: updateClient.mutateAsync,
            isPending: updateClient.isPending,
        },
        updateClientStatus: {
            mutate: updateClientStatus.mutate,
            isPending: updateClientStatus.isPending,
        },
    };
}