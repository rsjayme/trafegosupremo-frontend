import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { useState } from "react";
import { DropZone } from "@/components/DropZone";
import PieChartWidget from "./PieChartWidget";
import FunnelChartWidget from "./FunnelChartWidget";
import OverviewWidget from "./OverviewWidget";
import LineChartWidget from "./LineChartWidget";
import { METRICS } from "./metrics";

interface ReportsCanvasProps {
    widgets: Widget[];
    onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
    onRemoveWidget: (id: string) => void;
    onAddWidget: (widget: Widget) => void;
    data: MockData;
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

    // Métricas já estão normalizadas no objeto METRICS
    const metricOptions = Object.entries(METRICS).reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value.label;
        return acc;
    }, {});

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
                                    <label className="text-sm font-medium">Nível</label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onUpdate({
                                                config: {
                                                    ...widget.config,
                                                    level: 'account',
                                                    campaignId: undefined,
                                                    campaignIds: undefined
                                                }
                                            })}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${widget.config.level === 'account'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                }`}
                                        >
                                            Conta
                                        </button>
                                        <button
                                            onClick={() => onUpdate({
                                                config: {
                                                    ...widget.config,
                                                    level: 'campaign'
                                                }
                                            })}
                                            className={`px-3 py-1 rounded-full text-sm transition-colors ${widget.config.level === 'campaign'
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                }`}
                                        >
                                            Campanha
                                        </button>
                                    </div>
                                </div>

                                {widget.config.level === 'campaign' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Campanhas</label>
                                        <div className="max-h-48 overflow-y-auto border rounded-md p-2 space-y-2">
                                            {data.accounts[0]?.id && data.campaigns.map((campaign) => (
                                                <label key={campaign.campaign_name} className="flex items-center space-x-2 cursor-pointer hover:bg-secondary/20 p-1 rounded">
                                                    <input
                                                        type="checkbox"
                                                        checked={widget.config.campaignIds?.includes(campaign.campaign_name) ||
                                                            widget.config.campaignId === campaign.campaign_name}
                                                        onChange={(e) => {
                                                            const currentIds = widget.config.campaignIds ||
                                                                (widget.config.campaignId ? [widget.config.campaignId] : []);
                                                            const newIds = e.target.checked
                                                                ? [...currentIds, campaign.campaign_name]
                                                                : currentIds.filter(id => id !== campaign.campaign_name);

                                                            onUpdate({
                                                                config: {
                                                                    ...widget.config,
                                                                    campaignIds: newIds,
                                                                    campaignId: undefined
                                                                }
                                                            });
                                                        }}
                                                        className="rounded border-gray-300 focus:ring-primary"
                                                    />
                                                    <span className="text-sm truncate">{campaign.campaign_name}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {widget.type === "pieChart" ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Tipo de Breakdown</label>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries({
                                                    demographics: "Demografia",
                                                    devices: "Dispositivos",
                                                    locations: "Localização"
                                                }).map(([value, label]) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => onUpdate({
                                                            config: {
                                                                ...widget.config,
                                                                breakdown: value as "demographics" | "devices" | "locations"
                                                            }
                                                        })}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${widget.config.breakdown === value
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Métrica</label>
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries({
                                                    impressions: "Impressões",
                                                    clicks: "Cliques",
                                                    spend: "Gastos",
                                                    reach: "Alcance"
                                                }).map(([value, label]) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => onUpdate({
                                                            config: {
                                                                ...widget.config,
                                                                metric: value
                                                            }
                                                        })}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${widget.config.metric === value
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : widget.type === "funnel" ? (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Métricas do Funil</label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(metricOptions).map(([key, label]) => {
                                                const normalizedKey = key;
                                                const isSelected = widget.config.funnelMetrics?.includes(normalizedKey);
                                                const isDisabled = widget.config.funnelMetrics &&
                                                    widget.config.funnelMetrics.length >= 3 &&
                                                    !isSelected;

                                                return (
                                                    <button
                                                        key={normalizedKey}
                                                        onClick={() => {
                                                            const currentMetrics = widget.config.funnelMetrics || [];
                                                            let newMetrics = isSelected
                                                                ? currentMetrics.filter(m => m !== normalizedKey)
                                                                : [...currentMetrics, normalizedKey];

                                                            // Limita a 3 métricas
                                                            newMetrics = newMetrics.slice(0, 3);

                                                            onUpdate({
                                                                config: {
                                                                    ...widget.config,
                                                                    funnelMetrics: newMetrics
                                                                }
                                                            });
                                                        }}
                                                        disabled={isDisabled}
                                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${isSelected
                                                                ? "bg-primary text-primary-foreground"
                                                                : isDisabled
                                                                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Selecione até 3 métricas para formar o funil
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Métricas</label>
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(metricOptions).map(([key, label]) => {
                                                const normalizedKey = key;
                                                const isSelected = widget.config.metrics?.includes(normalizedKey);
                                                return (
                                                    <button
                                                        key={normalizedKey}
                                                        onClick={() => {
                                                            const currentMetrics = widget.config.metrics || [];
                                                            const newMetrics = isSelected
                                                                ? currentMetrics.filter(m => m !== normalizedKey)
                                                                : [...currentMetrics, normalizedKey];
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
            {widget.type === "lineChart" && <LineChartWidget widget={widget} data={data} />}
            {widget.type === "pieChart" && <PieChartWidget widget={widget} data={data} />}
            {widget.type === "funnel" && <FunnelChartWidget widget={widget} data={data} />}
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
        <div className="space-y-4 p-4" id="reports-canvas">
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