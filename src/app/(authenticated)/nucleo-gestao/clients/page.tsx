'use client';

import { useState } from 'react';
import { Plus, Pencil } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { ClientsTable } from '@/components/clients/clients-table';
import { ClientsFilters } from '@/components/clients/clients-filters';
import { ClientFormDialog } from '@/components/gestao/clients/ClientFormDialog';
import { useClients } from '@/hooks/useClients';
import { FilterClientsParams } from '@/services/clients';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type ClientData } from '@/lib/schemas/client';

export default function ClientsPage() {
    const [filters, setFilters] = useState<FilterClientsParams>({
        page: 1,
        limit: 10,
    });
    const [statusUpdateDialog, setStatusUpdateDialog] = useState<{
        isOpen: boolean;
        clientId?: number;
        newStatus?: 'ATIVO' | 'INATIVO';
    }>({
        isOpen: false,
    });

    const {
        clients,
        isLoading,
        createClient,
        updateClient,
        updateClientStatus,
    } = useClients(filters);

    const handleFilterChange = (newFilters: FilterClientsParams) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
            page: 1,
            limit: 10,
        });
    };

    const handleUpdateStatus = (clientId: number, newStatus: 'ATIVO' | 'INATIVO') => {
        setStatusUpdateDialog({
            isOpen: true,
            clientId,
            newStatus,
        });
    };

    const handleConfirmStatusUpdate = () => {
        if (statusUpdateDialog.clientId && statusUpdateDialog.newStatus) {
            updateClientStatus.mutate({
                id: statusUpdateDialog.clientId,
                status: statusUpdateDialog.newStatus,
            });
        }
        setStatusUpdateDialog({ isOpen: false });
    };

    const handleEdit = (client: ClientData) => (
        <ClientFormDialog
            trigger={
                <Button variant="ghost" className="w-full justify-start">
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                </Button>
            }
            defaultValues={client}
            onSubmit={async (data) => {
                await updateClient.mutateAsync({ id: client.id, data });
            }}
        />
    );

    return (
        <div className="h-full flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-4">
                <h1 className="font-medium">Gestão de Clientes</h1>
                <ClientFormDialog
                    trigger={
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Cliente
                        </Button>
                    }
                    onSubmit={createClient.mutateAsync}
                />
            </div>

            <div className="flex-1 space-y-4 p-4">
                <ClientsFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />

                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <span className="text-muted-foreground">Carregando...</span>
                    </div>
                ) : (
                    <ClientsTable
                        data={clients}
                        onUpdateStatus={handleUpdateStatus}
                        onEdit={handleEdit}
                    />
                )}
            </div>

            <AlertDialog
                open={statusUpdateDialog.isOpen}
                onOpenChange={(isOpen) =>
                    setStatusUpdateDialog(prev => ({ ...prev, isOpen }))
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {statusUpdateDialog.newStatus === 'INATIVO'
                                ? 'Inativar Cliente'
                                : 'Ativar Cliente'
                            }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja {' '}
                            {statusUpdateDialog.newStatus === 'INATIVO'
                                ? 'inativar'
                                : 'ativar'
                            } este cliente?
                            {statusUpdateDialog.newStatus === 'INATIVO' &&
                                ' O cliente não será excluído, apenas ficará inativo no sistema.'
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmStatusUpdate}>
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}