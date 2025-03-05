import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { Chart as ChartJS, ChartOptions, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DropZone } from "@/components/DropZone";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement);

interface ReportsCanvasProps {
    widgets: Widget[];
    onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
    onRemoveWidget: (id: string) => void;
    onAddWidget: (widget: Widget) => void;
    data: MockData;
}

const COLORS = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(153, 102, 255, 0.8)',
];

function OverviewWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const metrics = {
        impressions: { label: "Impressões", format: formatNumber },
        clicks: { label: "Cliques", format: formatNumber },
        spend: { label: "Gasto", format: formatCurrency },
        results: { label: "Resultados", format: formatNumber },
        ctr: { label: "CTR", format: formatPercent },
        cpc: { label: "CPC", format: formatCurrency },
        cpa: { label: "CPA", format: formatCurrency },
        // Actions metrics
        page_engagement: { label: "Engajamento da Página", format: formatNumber },
        post_engagement: { label: "Engajamento do Post", format: formatNumber },
        post_reaction: { label: "Reações", format: formatNumber },
        link_click: { label: "Cliques no Link", format: formatNumber },
        video_view: { label: "Visualizações de Vídeo", format: formatNumber },
        comment: { label: "Comentários", format: formatNumber },
        post: { label: "Posts", format: formatNumber },
        onsite_conversion_post_save: { label: "Salvamentos", format: formatNumber },
        onsite_conversion_messaging_conversation_started_7d: { label: "Conversas Iniciadas", format: formatNumber },
        onsite_conversion_messaging_first_reply: { label: "Primeiras Respostas", format: formatNumber },
    };

    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignId
            ? data.campaigns.filter(campaign => campaign.id === widget.config.campaignId)
            : data.campaigns;

    const aggregatedMetrics = items.reduce(
        (acc: Record<string, number>, item) => {
            // Agregar métricas regulares
            Object.entries(item.metrics).forEach(([key, value]) => {
                acc[key] = (acc[key] || 0) + value;
            });

            // Agregar métricas de actions
            item.actions?.forEach(action => {
                acc[action.action_type] = (acc[action.action_type] || 0) + Number(action.value);
            });

            return acc;
        },
        {}
    );

    return (
        <div className="grid grid-cols-4 gap-6">
            {widget.config.metrics?.map((metricKey: string) => {
                const metric = metrics[metricKey as keyof typeof metrics];
                if (!metric) return null;

                return (
                    <div key={metricKey} className="space-y-1">
                        <div className="text-sm text-muted-foreground">{metric.label}</div>
                        <div className="text-2xl font-semibold">
                            {metric.format(aggregatedMetrics[metricKey] || 0)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function LineChartWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const metrics = {
        impressions: { label: "Impressões", format: formatNumber },
        clicks: { label: "Cliques", format: formatNumber },
        spend: { label: "Gasto", format: formatCurrency },
        results: { label: "Resultados", format: formatNumber },
        ctr: { label: "CTR", format: formatPercent },
        cpc: { label: "CPC", format: formatCurrency },
        cpa: { label: "CPA", format: formatCurrency },
        // Actions metrics
        page_engagement: { label: "Engajamento da Página", format: formatNumber },
        post_engagement: { label: "Engajamento do Post", format: formatNumber },
        post_reaction: { label: "Reações", format: formatNumber },
        link_click: { label: "Cliques no Link", format: formatNumber },
        video_view: { label: "Visualizações de Vídeo", format: formatNumber },
        comment: { label: "Comentários", format: formatNumber },
        post: { label: "Posts", format: formatNumber },
        onsite_conversion_post_save: { label: "Salvamentos", format: formatNumber },
        onsite_conversion_messaging_conversation_started_7d: { label: "Conversas Iniciadas", format: formatNumber },
        onsite_conversion_messaging_first_reply: { label: "Primeiras Respostas", format: formatNumber },
    };

    const account = data.accounts[0];
    if (!account?.daily) {
        console.log('Sem dados diários disponíveis para o gráfico de linha');
        return (
            <div className="h-[400px] w-full p-4 flex items-center justify-center">
                <p className="text-muted-foreground">Sem dados disponíveis</p>
            </div>
        );
    }

    console.log('Dados diários para o gráfico:', account.daily);

    const chartData = {
        labels: account.daily.dates,
        datasets: widget.config.metrics?.map((metricKey: string, index: number) => {
            const metric = metrics[metricKey as keyof typeof metrics];
            return {
                label: metric?.label || metricKey,
                data: account.daily.metrics[metricKey as keyof typeof account.daily.metrics] || [],
                borderColor: COLORS[index % COLORS.length],
                backgroundColor: COLORS[index % COLORS.length],
                tension: 0.4,
            };
        }) || [],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label(context) {
                        const value = context.raw as number;
                        const metric = metrics[widget.config.metrics?.[context.datasetIndex || 0] as keyof typeof metrics];
                        return metric ? `${context.dataset.label}: ${metric.format(value)}` : context.dataset.label || '';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback(value) {
                        const firstMetric = widget.config.metrics?.[0];
                        if (!firstMetric) return value;
                        const metric = metrics[firstMetric as keyof typeof metrics];
                        return metric ? metric.format(Number(value)) : value;
                    }
                }
            },
        },
    };

    return (
        <div className="h-[400px] w-full p-4">
            <Line data={chartData} options={options} />
        </div>
    );
}

function WidgetCard({
    widget,
    data,
    onUpdate,
    onRemove,
}: {
    widget: Widget;
    data: MockData;
    onUpdate: (updates: Partial<Widget>) => void;
    onRemove: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);
    const containerClass = widget.type === "overview"
        ? "relative p-4 rounded-lg border bg-card col-span-3"
        : "relative p-4 rounded-lg border bg-card col-span-2 row-span-2";

    const metrics = {
        // Métricas básicas
        impressions: "Impressões",
        clicks: "Cliques",
        spend: "Gasto",
        results: "Resultados",
        ctr: "CTR",
        cpc: "CPC",
        cpa: "CPA",
        // Métricas de actions
        page_engagement: "Engajamento da Página",
        post_engagement: "Engajamento do Post",
        post_reaction: "Reações",
        link_click: "Cliques no Link",
        video_view: "Visualizações de Vídeo",
        comment: "Comentários",
        post: "Posts",
        onsite_conversion_post_save: "Salvamentos",
        onsite_conversion_messaging_conversation_started_7d: "Conversas Iniciadas",
        onsite_conversion_messaging_first_reply: "Primeiras Respostas",
    };

    return (
        <div
            className={containerClass}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="mb-4 font-medium">{widget.title}</div>

            {isHovered && (
                <div className="absolute -top-3 -right-3 flex gap-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon" variant="secondary">
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Configurar Widget</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Título</label>
                                    <input
                                        type="text"
                                        value={widget.title}
                                        onChange={(e) => onUpdate({ title: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-md"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Métricas</label>
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(metrics).map(([key, label]) => {
                                            const isSelected = widget.config.metrics?.includes(key);
                                            return (
                                                <button
                                                    key={key}
                                                    onClick={() => {
                                                        const currentMetrics = widget.config.metrics || [];
                                                        const newMetrics = isSelected
                                                            ? currentMetrics.filter((m: string) => m !== key)
                                                            : [...currentMetrics, key];
                                                        onUpdate({
                                                            config: {
                                                                ...widget.config,
                                                                metrics: newMetrics
                                                            }
                                                        });
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${isSelected
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                        }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button size="icon" variant="destructive" onClick={onRemove}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {widget.type === "overview" && <OverviewWidget widget={widget} data={data} />}
            {widget.type === "lineChart" && <LineChartWidget widget={widget} data={data} />}
        </div>
    );
}

export function ReportsCanvas({
    widgets,
    onUpdateWidget,
    onRemoveWidget,
    onAddWidget,
    data,
}: ReportsCanvasProps) {
    const sortedWidgets = [...widgets].sort((a, b) => a.position.y - b.position.y);

    return (
        <div className="space-y-4 p-4">
            <DropZone
                onDrop={onAddWidget}
                index={0}
                widgets={widgets}
            />
            {sortedWidgets.map((widget, index) => (
                <div key={widget.id}>
                    <WidgetCard
                        widget={widget}
                        data={data}
                        onUpdate={(updates) => onUpdateWidget(widget.id, updates)}
                        onRemove={() => onRemoveWidget(widget.id)}
                    />
                    <DropZone
                        onDrop={onAddWidget}
                        index={index + 1}
                        widgets={widgets}
                    />
                </div>
            ))}
        </div>
    );
}