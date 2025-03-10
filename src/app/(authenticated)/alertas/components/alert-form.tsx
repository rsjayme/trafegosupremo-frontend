"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarBlank } from "@phosphor-icons/react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreateBudgetAlertDTO } from "@/types/budget-alerts";

interface AlertFormProps {
    brandId: number;
    onSubmit: (data: CreateBudgetAlertDTO) => Promise<void>;
    initialData?: Partial<CreateBudgetAlertDTO>;
}

export function AlertForm({ brandId, onSubmit, initialData }: AlertFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [threshold, setThreshold] = useState(initialData?.threshold?.toString() || "");
    const [startDate, setStartDate] = useState<Date | undefined>(
        initialData?.startDate ? new Date(initialData.startDate) : undefined
    );
    const [webhookUrl, setWebhookUrl] = useState(initialData?.webhookUrl || "");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate) return;

        setIsSubmitting(true);
        try {
            const numericThreshold = parseFloat(threshold.replace(',', '.'));

            if (isNaN(numericThreshold)) {
                toast.error("Por favor, insira um valor válido");
                return;
            }

            if (numericThreshold <= 0) {
                toast.error("O valor deve ser maior que zero");
                return;
            }

            await onSubmit({
                brandId,
                threshold: numericThreshold,
                startDate: startDate.toISOString(),
                webhookUrl,
            });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao salvar alerta");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Valor Limite (R$)</label>
                <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    placeholder="0,00"
                    required
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                        >
                            <CalendarBlank className="mr-2 h-4 w-4" />
                            {startDate ? (
                                format(startDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
                            ) : (
                                <span>Selecione uma data</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">URL do Webhook (Discord)</label>
                <Input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    required
                />
            </div>

            <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || !threshold || !startDate || !webhookUrl}
            >
                {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
        </form>
    );
}