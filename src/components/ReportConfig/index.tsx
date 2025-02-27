"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useState } from "react";

export interface Metric {
    id: string;
    name: string;
    key: string;
    format: "currency" | "number" | "percent";
}

const availableMetrics: Metric[] = [
    { id: "1", name: "Orçamento", key: "budget", format: "currency" },
    { id: "2", name: "Gasto", key: "spent", format: "currency" },
    { id: "3", name: "Resultados", key: "results", format: "number" },
    { id: "4", name: "CPA", key: "cpa", format: "currency" },
    { id: "5", name: "Impressões", key: "impressions", format: "number" },
    { id: "6", name: "Cliques", key: "clicks", format: "number" },
    { id: "7", name: "CTR", key: "ctr", format: "percent" },
];

export interface ReportConfigProps {
    onConfigChange: (config: {
        metrics: Metric[];
        dateRange: { from: Date | undefined; to: Date | undefined };
        status: string;
    }) => void;
}

export function ReportConfig({ onConfigChange }: ReportConfigProps) {
    const [selectedMetrics, setSelectedMetrics] = useState<Metric[]>(availableMetrics);
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });
    const [status, setStatus] = useState<string>("all");

    const toggleMetric = (metric: Metric) => {
        const isSelected = selectedMetrics.some((m) => m.id === metric.id);
        let newMetrics: Metric[];

        if (isSelected) {
            newMetrics = selectedMetrics.filter((m) => m.id !== metric.id);
        } else {
            newMetrics = [...selectedMetrics, metric];
        }

        setSelectedMetrics(newMetrics);
        onConfigChange({ metrics: newMetrics, dateRange, status });
    };

    return (
        <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm border">
            <div>
                <h2 className="text-lg font-medium mb-4">Configurar Relatório</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Período
                        </label>
                        <DateRangePicker
                            date={dateRange}
                            onDateChange={(newDateRange) => {
                                setDateRange(newDateRange);
                                onConfigChange({
                                    metrics: selectedMetrics,
                                    dateRange: newDateRange,
                                    status,
                                });
                            }}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Status das Campanhas
                        </label>
                        <Select
                            value={status}
                            onValueChange={(value) => {
                                setStatus(value);
                                onConfigChange({
                                    metrics: selectedMetrics,
                                    dateRange,
                                    status: value,
                                });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="Ativa">Ativas</SelectItem>
                                <SelectItem value="Pausada">Pausadas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-medium mb-3">Métricas</h3>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-4">
                        {availableMetrics.map((metric) => (
                            <Button
                                key={metric.id}
                                variant={selectedMetrics.some((m) => m.id === metric.id) ? "default" : "outline"}
                                onClick={() => toggleMetric(metric)}
                                className="justify-between"
                            >
                                {metric.name}
                                {selectedMetrics.some((m) => m.id === metric.id) ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <X className="h-4 w-4" />
                                )}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}