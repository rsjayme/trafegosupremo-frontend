import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";
import type { MetricDefinition } from "../ReportsCanvas/metric-categories";
import { METRIC_CATEGORIES } from "../ReportsCanvas/metric-categories";
import { CategoryGroup } from "../MetricSelector/CategoryGroup";
import { SearchBar } from "../MetricSelector/SearchBar";

interface MetricSelectorProps {
    selectedMetrics: string[];
    onSelectionChange: (metrics: string[]) => void;
    maxSelections?: number;
    title?: string;
}

export function MetricSelector({
    selectedMetrics,
    onSelectionChange,
    maxSelections,
    title = "Selecionar Métricas"
}: MetricSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");

    // Filter metrics based on search
    const getFilteredMetrics = React.useCallback((categoryId: string): [string, MetricDefinition][] => {
        const category = METRIC_CATEGORIES[categoryId as keyof typeof METRIC_CATEGORIES];
        if (!searchTerm) return Object.entries(category.metrics);

        const term = searchTerm.toLowerCase();
        return Object.entries(category.metrics).filter(
            ([, metric]) =>
                metric.label.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full justify-start"
                >
                    <Settings2 className="h-4 w-4" />
                    <span className="flex-1 text-left">{title}</span>
                    <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {selectedMetrics.length}
                    </span>
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-3xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold">
                            {title}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Fechar</span>
                            </Button>
                        </Dialog.Close>
                    </div>

                    <SearchBar
                        onSearch={setSearchTerm}
                        placeholder="Buscar métricas..."
                    />

                    <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-2">
                            {Object.entries(METRIC_CATEGORIES).map(([id, category]) => {
                                const categoryMetrics = getFilteredMetrics(id);
                                if (categoryMetrics.length === 0 && searchTerm) return null;

                                return (
                                    <CategoryGroup
                                        key={id}
                                        category={category}
                                        metrics={categoryMetrics}
                                        selectedMetrics={new Set(selectedMetrics)}
                                        onSelectionChange={(metricIds: string[]) => {
                                            if (maxSelections && metricIds.length > maxSelections) {
                                                return;
                                            }
                                            onSelectionChange(metricIds);
                                        }}
                                        maxSelections={maxSelections}
                                    />
                                );
                            })}
                        </div>
                    </ScrollArea>

                    <div className="flex items-center justify-end gap-2 border-t pt-4">
                        <Dialog.Close asChild>
                            <Button variant="outline">Cancelar</Button>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                            <Button onClick={() => setIsOpen(false)}>
                                Aplicar
                            </Button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}