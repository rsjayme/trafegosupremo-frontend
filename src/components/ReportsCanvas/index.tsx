import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend, TooltipItem, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
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

const BORDERS = [
    'rgba(54, 162, 235, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(153, 102, 255, 1)',
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
    };

    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignId
            ? data.campaigns.filter(c => c.id === widget.config.campaignId)
            : data.campaigns;
    const aggregatedMetrics = items.reduce(
        (acc, item) => {
            Object.entries(item.metrics).forEach(([key, value]) => {
                acc[key] = (acc[key] || 0) + value;
            });
            return acc;
        },
        {} as Record<string, number>
    );

    return (
        <div className="grid grid-cols-4 gap-6">
            {widget.config.metrics?.map((metricKey) => {
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

function PieChartWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignId
            ? data.campaigns.filter(c => c.id === widget.config.campaignId)
            : data.campaigns;
    const demographic = widget.config.demographic || "age";

    const aggregatedData = items.reduce(
        (acc, item) => {
            Object.entries(item.demographics[demographic as keyof typeof item.demographics]).forEach(
                ([key, value]) => {
                    acc[key] = (acc[key] || 0) + value;
                }
            );
            return acc;
        },
        {} as Record<string, number>
    );

    const labels = Object.keys(aggregatedData);
    const values = Object.values(aggregatedData).map(value => value / items.length);

    const chartData = {
        labels,
        datasets: [
            {
                data: values,
                backgroundColor: COLORS,
                borderColor: BORDERS,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label(tooltipItem: TooltipItem<"pie">) {
                        const value = tooltipItem.raw as number;
                        return `${tooltipItem.label}: ${value.toFixed(1)}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="h-[400px] w-full p-4">
            <Pie data={chartData} options={options} />
        </div>
    );
}

function LineChartWidget({ widget }: { widget: Widget }) {
    const metrics = {
        impressions: { label: "Impressões", format: formatNumber },
        clicks: { label: "Cliques", format: formatNumber },
        spend: { label: "Gasto", format: formatCurrency },
        results: { label: "Resultados", format: formatNumber },
        ctr: { label: "CTR", format: formatPercent },
        cpc: { label: "CPC", format: formatCurrency },
        cpa: { label: "CPA", format: formatCurrency },
    };

    const chartData = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: widget.config.metrics?.map((metricKey, index) => {
            const metric = metrics[metricKey as keyof typeof metrics];
            return {
                label: metric?.label || metricKey,
                data: [
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                    Math.random() * 1000,
                ],
                borderColor: COLORS[index % COLORS.length],
                backgroundColor: COLORS[index % COLORS.length],
                tension: 0.4,
            };
        }) || [],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label(tooltipItem: TooltipItem<"line">) {
                        const value = tooltipItem.raw as number;
                        const metric = metrics[widget.config.metrics?.[tooltipItem.datasetIndex || 0] as keyof typeof metrics];
                        return metric ? `${tooltipItem.dataset.label}: ${metric.format(value)}` : tooltipItem.dataset.label || '';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-[400px] w-full p-4">
            <Line data={chartData} options={options} />
        </div>
    );
}

function BarChartWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const metrics = {
        impressions: { label: "Impressões", format: formatNumber },
        clicks: { label: "Cliques", format: formatNumber },
        spend: { label: "Gasto", format: formatCurrency },
        results: { label: "Resultados", format: formatNumber },
        ctr: { label: "CTR", format: formatPercent },
        cpc: { label: "CPC", format: formatCurrency },
        cpa: { label: "CPA", format: formatCurrency },
    };

    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignId
            ? data.campaigns.filter(c => c.id === widget.config.campaignId)
            : data.campaigns;

    const chartData = {
        labels: items.map(item => item.name),
        datasets: widget.config.metrics?.map((metricKey, index) => {
            const metric = metrics[metricKey as keyof typeof metrics];
            return {
                label: metric?.label || metricKey,
                data: items.map(item => item.metrics[metricKey as keyof typeof item.metrics]),
                backgroundColor: COLORS[index % COLORS.length],
                borderColor: BORDERS[index % BORDERS.length],
                borderWidth: 1,
            };
        }) || [],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label(tooltipItem: TooltipItem<"bar">) {
                        const value = tooltipItem.raw as number;
                        const metric = metrics[widget.config.metrics?.[tooltipItem.datasetIndex || 0] as keyof typeof metrics];
                        return metric ? `${tooltipItem.dataset.label}: ${metric.format(value)}` : tooltipItem.dataset.label || '';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-[400px] w-full p-4">
            <Bar data={chartData} options={options} />
        </div>
    );
}

function FunnelWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const metrics = {
        impressions: { label: "Impressões", format: formatNumber },
        clicks: { label: "Cliques", format: formatNumber },
        spend: { label: "Gasto", format: formatCurrency },
        results: { label: "Resultados", format: formatNumber },
        ctr: { label: "CTR", format: formatPercent },
        cpc: { label: "CPC", format: formatCurrency },
        cpa: { label: "CPA", format: formatCurrency },
    };

    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignId
            ? data.campaigns.filter(c => c.id === widget.config.campaignId)
            : data.campaigns;
    const aggregatedMetrics = items.reduce(
        (acc, item) => {
            Object.entries(item.metrics).forEach(([key, value]) => {
                acc[key] = (acc[key] || 0) + value;
            });
            return acc;
        },
        {} as Record<string, number>
    );

    const funnelMetrics = widget.config.funnelMetrics || [];
    const chartData = {
        labels: funnelMetrics.map(key => metrics[key as keyof typeof metrics]?.label || key),
        datasets: [
            {
                data: funnelMetrics.map(key => aggregatedMetrics[key] || 0),
                backgroundColor: COLORS,
                borderColor: BORDERS,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y' as const,
        scales: {
            x: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label(tooltipItem: TooltipItem<"bar">) {
                        const value = tooltipItem.raw as number;
                        const metricKey = funnelMetrics[tooltipItem.dataIndex];
                        const metric = metrics[metricKey as keyof typeof metrics];
                        return metric ? metric.format(value) : value.toString();
                    }
                }
            }
        }
    };

    return (
        <div className="h-[400px] w-full p-4">
            <Bar data={chartData} options={options} />
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
        impressions: "Impressões",
        clicks: "Cliques",
        spend: "Gasto",
        results: "Resultados",
        ctr: "CTR",
        cpc: "CPC",
        cpa: "CPA",
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
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Nível</label>
                                            <Select
                                                value={widget.config.level}
                                                onValueChange={(value) =>
                                                    onUpdate({
                                                        config: {
                                                            ...widget.config,
                                                            level: value as "account" | "campaign",
                                                            campaignId: value === "account" ? undefined : widget.config.campaignId,
                                                        }
                                                    })
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="account">Conta</SelectItem>
                                                    <SelectItem value="campaign">Campanha</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {widget.config.level === "campaign" && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Campanha</label>
                                                <Select
                                                    value={widget.config.campaignId}
                                                    onValueChange={(value) =>
                                                        onUpdate({
                                                            config: {
                                                                ...widget.config,
                                                                campaignId: value,
                                                            }
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {data.campaigns.map((campaign) => (
                                                            <SelectItem key={campaign.id} value={campaign.id}>
                                                                {campaign.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {widget.type === "overview" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Métricas</label>
                                        <ScrollArea className="h-[200px] rounded-md border p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(metrics).map(([key, label]) => {
                                                    const isSelected = widget.config.metrics?.includes(key);
                                                    return (
                                                        <button
                                                            key={key}
                                                            onClick={() => {
                                                                const metrics = widget.config.metrics || [];
                                                                const newMetrics = isSelected
                                                                    ? metrics.filter((m) => m !== key)
                                                                    : [...metrics, key];
                                                                onUpdate({
                                                                    config: {
                                                                        ...widget.config,
                                                                        metrics: newMetrics,
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
                                        </ScrollArea>
                                    </div>
                                )}

                                {widget.type === "pieChart" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Dado Demográfico</label>
                                        <Select
                                            value={widget.config.demographic}
                                            onValueChange={(value) =>
                                                onUpdate({
                                                    config: {
                                                        ...widget.config,
                                                        demographic: value,
                                                    }
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="age">Idade</SelectItem>
                                                <SelectItem value="gender">Gênero</SelectItem>
                                                <SelectItem value="location">Localização</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {widget.type === "funnel" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Métricas do Funil (máx. 3)</label>
                                        <ScrollArea className="h-[200px] rounded-md border p-4">
                                            <div className="space-y-2">
                                                {Object.entries(metrics).map(([key, label]) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            id={`funnel-${key}`}
                                                            checked={widget.config.funnelMetrics?.includes(
                                                                key
                                                            )}
                                                            disabled={
                                                                !widget.config.funnelMetrics?.includes(key) &&
                                                                (widget.config.funnelMetrics?.length || 0) >= 3
                                                            }
                                                            onChange={(e) => {
                                                                const funnelMetrics =
                                                                    widget.config.funnelMetrics || [];
                                                                const newMetrics = e.target.checked
                                                                    ? [...funnelMetrics, key]
                                                                    : funnelMetrics.filter((m) => m !== key);
                                                                onUpdate({
                                                                    config: {
                                                                        ...widget.config,
                                                                        funnelMetrics: newMetrics,
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <label htmlFor={`funnel-${key}`}>{label}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button size="icon" variant="destructive" onClick={onRemove}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {widget.type === "overview" && <OverviewWidget widget={widget} data={data} />}
            {widget.type === "pieChart" && <PieChartWidget widget={widget} data={data} />}
            {widget.type === "funnel" && <FunnelWidget widget={widget} data={data} />}
            {widget.type === "lineChart" && <LineChartWidget widget={widget} />}
            {widget.type === "barChart" && <BarChartWidget widget={widget} data={data} />}
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
    // Ordena os widgets por posição y
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