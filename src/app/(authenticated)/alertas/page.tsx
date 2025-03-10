"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "@phosphor-icons/react";
import { useBudgetAlerts, useCreateBudgetAlert, useDeleteBudgetAlert, useUpdateBudgetAlert } from "@/hooks/useBudgetAlerts";
import { AlertForm, AlertList } from "./components";
import { useBrand } from "@/contexts/BrandContext";
import { UpdateBudgetAlertDTO } from "@/types/budget-alerts";

export default function AlertasPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const { selectedBrand } = useBrand();

    // Queries e Mutations
    const { data: alerts, isLoading } = useBudgetAlerts(selectedBrand?.id ?? 0, {
        enabled: !!selectedBrand,
    });
    const createAlert = useCreateBudgetAlert();
    const updateAlert = useUpdateBudgetAlert();
    const deleteAlert = useDeleteBudgetAlert();

    if (!selectedBrand) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <h1 className="text-2xl font-semibold mb-6">Alertas de Orçamento</h1>
                    <div className="bg-card p-6 rounded-lg shadow-sm border text-center space-y-4">
                        <p className="text-muted-foreground">Selecione uma marca para visualizar os alertas.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6">
            <div className="main-container space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Alertas de Orçamento</h1>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-5 w-5 mr-2" />
                                Novo Alerta
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Alerta de Orçamento</DialogTitle>
                            </DialogHeader>
                            <AlertForm
                                brandId={selectedBrand.id}
                                onSubmit={async (data) => {
                                    await createAlert.mutateAsync(data);
                                    setIsCreateDialogOpen(false);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                </div>

                <AlertList
                    alerts={alerts || []}
                    isLoading={isLoading}
                    onUpdate={(id: number, data: UpdateBudgetAlertDTO) => updateAlert.mutate({ id, data })}
                    onDelete={(id: number) => deleteAlert.mutate(id)}
                />
            </div>
        </div>
    );
}