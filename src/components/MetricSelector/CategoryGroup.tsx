import * as React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import type { MetricDefinition } from "../ReportsCanvas/metric-categories";

interface CategoryGroupProps {
    category: {
        id: string;
        label: string;
        description?: string;
    };
    metrics: [string, MetricDefinition][];
    selectedMetrics: Set<string>;
    onSelectionChange: (metrics: string[]) => void;
    maxSelections?: number;
}

export function CategoryGroup({
    category,
    metrics,
    selectedMetrics,
    onSelectionChange,
    maxSelections
}: CategoryGroupProps) {
    const activeMetricsCount = metrics.filter(([metricId]) => selectedMetrics.has(metricId)).length;
    const totalMetricsCount = metrics.length;

    const isDisabled = (metricId: string) => {
        if (!maxSelections) return false;
        return !selectedMetrics.has(metricId) && selectedMetrics.size >= maxSelections;
    };

    return (
        <Accordion type="single" collapsible>
            <AccordionItem value={category.id} className="border-none">
                <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">{category.label}</span>
                        <span className="text-xs text-muted-foreground">
                            ({activeMetricsCount}/{totalMetricsCount})
                        </span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 py-2">
                        {category.description && (
                            <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2">
                            {metrics.map(([metricId, metric]) => (
                                <button
                                    key={metricId}
                                    onClick={() => {
                                        const newSelection = selectedMetrics.has(metricId)
                                            ? Array.from(selectedMetrics).filter(id => id !== metricId)
                                            : [...Array.from(selectedMetrics), metricId];

                                        onSelectionChange(newSelection);
                                    }}
                                    disabled={isDisabled(metricId)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedMetrics.has(metricId)
                                            ? "bg-primary text-primary-foreground"
                                            : isDisabled(metricId)
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                >
                                    {metric.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}