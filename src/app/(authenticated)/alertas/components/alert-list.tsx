"use client";

import { useState } from "react";
import { BudgetAlert, UpdateBudgetAlertDTO } from "@/types/budget-alerts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { AlertForm } from "./alert-form";
import { Badge } from "@/components/ui/badge";

interface AlertListProps {
    alerts: BudgetAlert[];
    isLoading: boolean;
    onUpdate: (id: number, data: UpdateBudgetAlertDTO) => void;
    onDelete: (id: number) => void;
}

export function AlertList({ alerts, isLoading, onUpdate, onDelete }: AlertListProps) {
    const [editingAlert, setEditingAlert] = useState<BudgetAlert | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <p>Carregando alertas...</p>
            </div>
        );
    }

    if (alerts.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <p>Nenhum alerta cadastrado.</p>
            </div>
        );
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Valor Limite</TableHead>
                        <TableHead>Data Inicial</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Discord Webhook</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {alerts.map((alert) => (
                        <TableRow key={alert.id}>
                            <TableCell>
                                R$ {Number(alert.threshold).toFixed(2)}
                            </TableCell>
                            <TableCell>
                                {format(new Date(alert.startDate), "d 'de' MMMM 'de' yyyy", {
                                    locale: ptBR,
                                })}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={alert.status === "ACTIVE" ? "success" : "warning"}
                                >
                                    {alert.status === "ACTIVE" ? "Ativo" : "Inativo"}
                                </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {alert.webhookUrl}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setEditingAlert(alert)}
                                    >
                                        <PencilSimple className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            if (confirm("Tem certeza que deseja excluir este alerta?")) {
                                                onDelete(alert.id);
                                            }
                                        }}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={!!editingAlert} onOpenChange={() => setEditingAlert(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Alerta de Orçamento</DialogTitle>
                    </DialogHeader>
                    {editingAlert && (
                        <AlertForm
                            brandId={editingAlert.brandId}
                            initialData={editingAlert}
                            onSubmit={async (data) => {
                                await onUpdate(editingAlert.id, {
                                    threshold: data.threshold,
                                    webhookUrl: data.webhookUrl,
                                    startDate: data.startDate,
                                });
                                setEditingAlert(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}