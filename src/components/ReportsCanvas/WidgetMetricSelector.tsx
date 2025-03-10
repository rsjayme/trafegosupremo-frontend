import { MetricSelector } from "@/components/MetricSelector";
import type { Widget } from "@/app/(authenticated)/relatorios/page";

interface WidgetMetricSelectorProps {
    widget: Widget;
    onUpdate: (updates: Partial<Widget>) => void;
}

export function WidgetMetricSelector({ widget, onUpdate }: WidgetMetricSelectorProps) {
    const getSelectedMetrics = () => {
        if (widget.type === "funnel") {
            return widget.config.funnelMetrics || [];
        }
        return widget.config.metrics || [];
    };

    const handleSelectionChange = (metrics: string[]) => {
        if (widget.type === "funnel") {
            onUpdate({
                config: {
                    ...widget.config,
                    funnelMetrics: metrics
                }
            });
        } else {
            onUpdate({
                config: {
                    ...widget.config,
                    metrics
                }
            });
        }
    };

    return (
        <MetricSelector
            selectedMetrics={getSelectedMetrics()}
            onSelectionChange={handleSelectionChange}
            maxSelections={widget.type === "funnel" ? 3 : undefined}
            title={widget.type === "funnel" ? "Selecionar Métricas do Funil" : "Selecionar Métricas"}
        />
    );
}