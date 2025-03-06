import { useRef } from "react";
import { useDrag } from "react-dnd";
import { Widget } from "@/app/(authenticated)/relatorios/page";
import { BarChart, PieChart, GitBranch, LineChart } from "lucide-react";

interface ReportsSidebarProps {
    onAddWidget: (widget: Widget) => void;
}

interface WidgetTemplate {
    type: Widget["type"];
    title: string;
    icon: React.ReactNode;
    defaultConfig: Omit<Widget, "id" | "position">;
}

const widgetTemplates: WidgetTemplate[] = [
    {
        type: "overview",
        title: "Visão Geral",
        icon: <BarChart className="w-5 h-5" />,
        defaultConfig: {
            type: "overview",
            title: "Visão Geral",
            size: { width: 3, height: 1 },
            config: {
                level: "account",
                metrics: ["impressions", "clicks", "spend", "results"],
                dateRange: {
                    start: null,
                    end: null,
                },
            },
        },
    },
    {
        type: "pieChart",
        title: "Gráfico de Pizza",
        icon: <PieChart className="w-5 h-5" />,
        defaultConfig: {
            type: "pieChart",
            title: "Distribuição",
            size: { width: 2, height: 2 },
            config: {
                level: "account",
                breakdown: "demographics", // Tipo de breakdown: demographics, devices, locations
                metric: "impressions", // Métrica principal
                dateRange: {
                    start: null,
                    end: null,
                },
            },
        },
    },
    {
        type: "funnel",
        title: "Funil",
        icon: <GitBranch className="w-5 h-5 rotate-180" />,
        defaultConfig: {
            type: "funnel",
            title: "Funil de Conversão",
            size: { width: 2, height: 2 },
            config: {
                level: "account",
                funnelMetrics: ["impressions", "clicks", "results"],
                dateRange: {
                    start: null,
                    end: null,
                },
            },
        },
    },
    {
        type: "lineChart",
        title: "Gráfico de Linha",
        icon: <LineChart className="w-5 h-5" />,
        defaultConfig: {
            type: "lineChart",
            title: "Métricas ao Longo do Tempo",
            size: { width: 2, height: 2 },
            config: {
                level: "account",
                metrics: ["impressions", "clicks"],
                dateRange: {
                    start: null,
                    end: null,
                },
            },
        },
    },
    {
        type: "barChart",
        title: "Gráfico de Colunas",
        icon: <BarChart className="w-5 h-5" />,
        defaultConfig: {
            type: "barChart",
            title: "Comparação de Métricas",
            size: { width: 2, height: 2 },
            config: {
                level: "account",
                metrics: ["impressions", "clicks"],
                dateRange: {
                    start: null,
                    end: null,
                },
            },
        },
    },
];

type DragItem = Omit<Widget, "id" | "position"> & { template: WidgetTemplate };

function DraggableWidget({ template }: { template: WidgetTemplate }) {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, connectDrag] = useDrag<DragItem, void, { isDragging: boolean }>({
        type: "WIDGET",
        item: {
            ...template.defaultConfig,
            template,
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    connectDrag(ref);

    return (
        <div
            ref={ref}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-move transition-colors hover:bg-accent ${isDragging ? "opacity-50" : ""
                }`}
        >
            {template.icon}
            <span>{template.title}</span>
        </div>
    );
}

export function ReportsSidebar({ onAddWidget }: ReportsSidebarProps) {
    return (
        <div className="w-64 border-r bg-card p-4">
            <h2 className="font-medium mb-4">Widgets Disponíveis</h2>
            <div className="space-y-2">
                {widgetTemplates.map((template) => (
                    <DraggableWidget
                        key={template.type}
                        template={template}
                    />
                ))}
            </div>
        </div>
    );
}