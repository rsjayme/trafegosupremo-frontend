import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { InsightsDaily } from "@/services/facebook-insights";

const DEFAULT_TIMELINE_DATA = {
    dates: [],
    metrics: {
        impressions: [],
        clicks: [],
        spend: [],
        ctr: [],
        cpc: [],
        cpm: []
    }
};
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

// Função para normalizar as chaves das métricas (substituir pontos por underscores)
function normalizeMetricKey(key: string): string {
    return key.replace(/\./g, '_');
}

function OverviewWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const metrics = {
        // Métricas básicas
        impressions: { label: "Impressões", format: formatNumber },
        clicks: { label: "Cliques", format: formatNumber },
        spend: { label: "Gasto", format: formatCurrency },
        results: { label: "Resultados", format: formatNumber },
        ctr: { label: "CTR", format: formatPercent },
        cpc: { label: "CPC", format: formatCurrency },
        cpa: { label: "CPA", format: formatCurrency },
        // Métricas de ações (usando underscores)
        onsite_conversion_total_messaging_connection: { label: "Conexões de Mensagem", format: formatNumber },
        page_engagement: { label: "Engajamento da Página", format: formatNumber },
        post_engagement: { label: "Engajamento do Post", format: formatNumber },
        comment: { label: "Comentários", format: formatNumber },
        onsite_conversion_messaging_user_depth_3_message_send: { label: "Mensagens (Profundidade 3)", format: formatNumber },
        onsite_conversion_messaging_first_reply: { label: "Primeiras Respostas", format: formatNumber },
        post: { label: "Posts", format: formatNumber },
        onsite_conversion_messaging_user_depth_2_message_send: { label: "Mensagens (Profundidade 2)", format: formatNumber },
        onsite_conversion_messaging_conversation_started_7d: { label: "Conversas Iniciadas", format: formatNumber },
        video_view: { label: "Visualizações de Vídeo", format: formatNumber },
        post_reaction: { label: "Reações", format: formatNumber },
        link_click: { label: "Cliques no Link", format: formatNumber }
    };

    // Filtra os itens com base no nível e campanhas selecionadas
    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignIds?.length
            ? data.campaigns.filter(campaign => widget.config.campaignIds?.includes(campaign.campaign_name))
            : widget.config.campaignId // Mantido para compatibilidade
                ? data.campaigns.filter(campaign => campaign.campaign_name === widget.config.campaignId)
                : data.campaigns;

    const aggregatedMetrics = items.reduce(
        (acc: Record<string, number>, item) => {
            // Para cada item (campanha ou conta)
            const currentMetrics = { ...acc };

            if ("metrics" in item) {
                // Se for Account, pega métricas do objeto metrics
                const metrics = item.metrics;
                currentMetrics.impressions = (acc.impressions || 0) + metrics.impressions;
                currentMetrics.clicks = (acc.clicks || 0) + metrics.clicks;
                currentMetrics.spend = (acc.spend || 0) + metrics.spend;
                currentMetrics.ctr = (acc.ctr || 0) + metrics.ctr;
                currentMetrics.cpc = (acc.cpc || 0) + metrics.cpc;
                currentMetrics.cpm = (acc.cpm || 0) + metrics.cpm;
            } else {
                // Se for Campaign, pega métricas direto do objeto
                currentMetrics.impressions = (acc.impressions || 0) + parseFloat(item.impressions || '0');
                currentMetrics.clicks = (acc.clicks || 0) + parseFloat(item.clicks || '0');
                currentMetrics.spend = (acc.spend || 0) + parseFloat(item.spend || '0');
                currentMetrics.ctr = (acc.ctr || 0) + parseFloat(item.ctr || '0');
                currentMetrics.cpc = (acc.cpc || 0) + parseFloat(item.cpc || '0');
                currentMetrics.cpm = (acc.cpm || 0) + parseFloat(item.cpm || '0');
            }

            // Métricas de ações
            if (item.actions) {
                item.actions.forEach(action => {
                    // Normaliza a chave da ação usando a função auxiliar
                    const actionKey = normalizeMetricKey(action.action_type);
                    currentMetrics[actionKey] = (currentMetrics[actionKey] || 0) + Number(action.value);
                });
            }

            return currentMetrics;
        },
        {}
    );

    return (
        <div className="grid grid-cols-4 gap-6">
            {widget.config.metrics?.map((metricKey: string) => {
                // Normaliza a chave da métrica
                const normalizedKey = normalizeMetricKey(metricKey);
                const metric = metrics[normalizedKey as keyof typeof metrics];

                if (!metric) {
                    console.log(`Métrica não encontrada: ${normalizedKey}`);
                    return null;
                }

                // Busca o valor usando a chave normalizada
                const value = aggregatedMetrics[normalizedKey] ?? 0;

                return (
                    <div key={metricKey} className="space-y-1">
                        <div className="text-sm text-muted-foreground">{metric.label}</div>
                        <div className="text-2xl font-semibold">
                            {metric.format(value)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

interface TimelineMetrics {
    impressions: number[];
    clicks: number[];
    spend: number[];
    ctr: number[];
    cpc: number[];
    cpm: number[];
}

interface TimelineData {
    dates: string[];
    metrics: TimelineMetrics;
}

// Métricas comuns para todos os widgets
const METRICS = {
    // Métricas básicas
    impressions: { label: "Impressões", format: formatNumber },
    clicks: { label: "Cliques", format: formatNumber },
    spend: { label: "Gasto", format: formatCurrency },
    results: { label: "Resultados", format: formatNumber },
    ctr: { label: "CTR", format: formatPercent },
    cpc: { label: "CPC", format: formatCurrency },
    cpa: { label: "CPA", format: formatCurrency },
    // Métricas de ações (usando underscores consistentemente)
    onsite_conversion_total_messaging_connection: { label: "Conexões de Mensagem", format: formatNumber },
    page_engagement: { label: "Engajamento da Página", format: formatNumber },
    post_engagement: { label: "Engajamento do Post", format: formatNumber },
    comment: { label: "Comentários", format: formatNumber },
    onsite_conversion_messaging_user_depth_3_message_send: { label: "Mensagens (Profundidade 3)", format: formatNumber },
    onsite_conversion_messaging_first_reply: { label: "Primeiras Respostas", format: formatNumber },
    post: { label: "Posts", format: formatNumber },
    onsite_conversion_messaging_user_depth_2_message_send: { label: "Mensagens (Profundidade 2)", format: formatNumber },
    onsite_conversion_messaging_conversation_started_7d: { label: "Conversas Iniciadas", format: formatNumber },
    video_view: { label: "Visualizações de Vídeo", format: formatNumber },
    post_reaction: { label: "Reações", format: formatNumber },
    link_click: { label: "Cliques no Link", format: formatNumber }
} as const;

function LineChartWidget({ widget, data }: { widget: Widget; data: MockData }) {
    const metrics = METRICS;

    // Função auxiliar para combinar dados diários de múltiplas campanhas
    const combineTimelineData = (campaigns: InsightsDaily[]): TimelineData => {
        const allDates = new Set<string>();
        const metricsMap = new Map<string, Map<string, number>>();

        // Coleta todas as datas e soma métricas por data
        campaigns.forEach(campaign => {
            if (campaign.date_start) {
                allDates.add(campaign.date_start);
                const metrics = new Map<string, number>();

                metricsMap.set(campaign.date_start, metrics);
                const dailyMetrics = metricsMap.get(campaign.date_start)!;

                // Soma métricas básicas
                dailyMetrics.set('impressions', (dailyMetrics.get('impressions') || 0) + parseFloat(campaign.impressions || '0'));
                dailyMetrics.set('clicks', (dailyMetrics.get('clicks') || 0) + parseFloat(campaign.clicks || '0'));
                dailyMetrics.set('spend', (dailyMetrics.get('spend') || 0) + parseFloat(campaign.spend || '0'));

                // Processa actions
                campaign.actions?.forEach(action => {
                    const key = normalizeMetricKey(action.action_type);
                    const value = typeof action.value === 'string' ? parseFloat(action.value) : Number(action.value);
                    dailyMetrics.set(key, (dailyMetrics.get(key) || 0) + value);
                });
            }
        });

        // Converte os dados agregados para o formato TimelineData
        const sortedDates = Array.from(allDates).sort();
        const timelineData: TimelineData = {
            dates: sortedDates,
            metrics: {
                impressions: [],
                clicks: [],
                spend: [],
                ctr: [],
                cpc: [],
                cpm: []
            }
        };

        // Preenche as métricas para cada data
        sortedDates.forEach(date => {
            const dailyMetrics = metricsMap.get(date)!;
            const impressions = dailyMetrics.get('impressions') || 0;
            const clicks = dailyMetrics.get('clicks') || 0;
            const spend = dailyMetrics.get('spend') || 0;

            timelineData.metrics.impressions.push(impressions);
            timelineData.metrics.clicks.push(clicks);
            timelineData.metrics.spend.push(spend);
            timelineData.metrics.ctr.push(clicks && impressions ? (clicks / impressions) * 100 : 0);
            timelineData.metrics.cpc.push(clicks && spend ? spend / clicks : 0);
            timelineData.metrics.cpm.push(impressions ? (spend / impressions) * 1000 : 0);
        });

        return timelineData;
    };

    // Filtra os dados com base no nível e campanhas selecionadas
    let timelineData: TimelineData;

    if (widget.config.level === "account") {
        timelineData = data.accounts[0]?.daily || DEFAULT_TIMELINE_DATA;
    } else {
        const selectedCampaigns = widget.config.campaignIds?.length
            ? data.campaigns.filter(campaign => widget.config.campaignIds?.includes(campaign.campaign_name))
            : widget.config.campaignId
                ? [data.campaigns.find(campaign => campaign.campaign_name === widget.config.campaignId)].filter(Boolean)
                : [data.campaigns[0]].filter(Boolean);

        if (!selectedCampaigns.length) {
            console.log('Sem dados diários disponíveis para o gráfico de linha');
            return (
                <div className="h-[400px] w-full p-4 flex items-center justify-center">
                    <p className="text-muted-foreground">Sem dados disponíveis</p>
                </div>
            );
        }

        timelineData = combineTimelineData(selectedCampaigns as InsightsDaily[]);
    }

    console.log('Dados diários combinados para o gráfico:', timelineData);

    const chartData = {
        labels: timelineData.dates,
        datasets: widget.config.metrics?.map((metricKey: string, index: number) => {
            const metric = metrics[metricKey as keyof typeof metrics];
            const metricData = timelineData.metrics[metricKey as keyof TimelineMetrics] || [];
            return {
                label: metric?.label || metricKey,
                data: metricData,
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

    // Métricas já estão normalizadas no objeto METRICS
    const metricOptions = Object.entries(METRICS).reduce((acc, [key, value]) => {
        acc[key] = value.label;
        return acc;
    }, {} as Record<string, string>);

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
                                                                    campaignId: undefined // Remove o campaignId antigo
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
                                                            ? currentMetrics.filter((m: string) => m !== normalizedKey)
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
                                                    {label as string}
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