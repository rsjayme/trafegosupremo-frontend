import { useState, useRef, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { DropZone } from "@/components/DropZone";
import { WidgetMetricSelector } from "./WidgetMetricSelector";
import PieChartWidget from "./PieChartWidget";
import FunnelChartWidget from "./FunnelChartWidget";
import OverviewWidget from "./OverviewWidget";
import LineChartWidget from "./LineChartWidget";
import { AIAnalysisWidget } from "./AIAnalysisWidget";

interface ReportsCanvasProps {
    widgets: Widget[];
    onUpdateWidget: (id: string, updates: Partial<Widget>) => void;
    onRemoveWidget: (id: string) => void;
    onAddWidget: (widget: Widget) => void;
    data: MockData;
}

interface WidgetCardProps {
    widget: Widget;
    data: MockData;
    onUpdate: (updates: Partial<Widget>) => void;
    onRemove: () => void;
}

function WidgetCard({ widget, data, onUpdate, onRemove }: WidgetCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const gripRef = useRef<HTMLDivElement>(null);

    const containerClass = widget.type === "overview"
        ? "relative p-4 rounded-lg border bg-card col-span-3"
        : "relative p-4 rounded-lg border bg-card col-span-2 row-span-2";

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: 'PLACED_WIDGET',
        item: () => ({
            id: widget.id,
            currentPosition: widget.position,
            type: 'PLACED_WIDGET'
        }),
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        previewOptions: {
            captureDraggingState: true
        }
    }), [widget.id, widget.position]);

    useEffect(() => {
        if (gripRef.current) {
            dragRef(gripRef);
        }
    }, [dragRef]);

    return (
        <div
            className={cn(
                containerClass,
                isDragging && "opacity-50",
                "transition-opacity duration-200"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                ref={gripRef}
                className={cn(
                    "absolute -left-3 top-1/2 -translate-y-1/2 p-2 cursor-move group opacity-0 transition-all duration-200",
                    isHovered && "opacity-100",
                    isDragging && "bg-primary/10 scale-110"
                )}
            >
                <GripVertical className={cn(
                    "h-4 w-4 transition-colors duration-200",
                    "group-hover:text-primary",
                    isDragging && "text-primary"
                )} />
            </div>
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
                                            {data.accounts[0]?.id && data.campaigns.map((campaign: { campaign_name: string }) => (
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

                                {widget.type === "pieChart" && (
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

                                        <div className="space-y-4">
                                            <label className="text-sm font-medium">Métrica</label>
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="mb-2 text-xs text-muted-foreground">Métricas Básicas</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries({
                                                            impressions: "Impressões",
                                                            clicks: "Cliques",
                                                            spend: "Gasto"
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

                                                <div>
                                                    <div className="mb-2 text-xs text-muted-foreground">Métricas de Engajamento</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries({
                                                            page_engagement: "Engajamento da Página",
                                                            post_engagement: "Engajamento do Post",
                                                            post_reaction: "Reações",
                                                            video_view: "Visualizações de Vídeo",
                                                            link_click: "Cliques no Link"
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

                                                <div>
                                                    <div className="mb-2 text-xs text-muted-foreground">Métricas de Conversação</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries({
                                                            onsite_conversion_messaging_conversation_started_7d: "Conversas Iniciadas",
                                                            onsite_conversion_messaging_first_reply: "Primeiras Respostas",
                                                            onsite_conversion_messaging_user_depth_2_message_send: "Mensagens (Prof. 2)",
                                                            onsite_conversion_messaging_user_depth_3_message_send: "Mensagens (Prof. 3)",
                                                            onsite_conversion_total_messaging_connection: "Conexões de Mensagem"
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
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Seletor de métricas (exceto para PieChart que tem seu próprio) */}
                                {widget.type !== "pieChart" && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Métricas</label>
                                        <WidgetMetricSelector
                                            widget={widget}
                                            onUpdate={onUpdate}
                                        />
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
            {widget.type === "aiAnalysis" && (
                <AIAnalysisWidget
                    brandId={Number(data.accounts[0]?.id)}
                    campaignId={widget.config.campaignId || ''}
                    period={{
                        since: data.since,
                        until: data.until
                    }}
                />
            )}
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
                onUpdateWidget={onUpdateWidget}
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
                        onUpdateWidget={onUpdateWidget}
                        index={index + 1}
                        widgets={widgets}
                    />
                </div>
            ))}
        </div>
    );
}