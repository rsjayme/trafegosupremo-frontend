import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { InsightsDaily } from "@/services/facebook-insights";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getAllMetrics, MetricDefinition } from "./metric-categories";

// Registrar os componentes do ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineChartWidgetProps {
    widget: Widget;
    data: MockData;
}

const COLORS = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(255, 99, 132, 0.8)',
    'rgba(153, 102, 255, 0.8)',
];

interface TimelineMetrics {
    [key: string]: number[];
}

interface TimelineData {
    dates: string[];
    metrics: TimelineMetrics;
}

type MetricsMap = {
    [key: string]: MetricDefinition;
};

const DEFAULT_TIMELINE_DATA: TimelineData = {
    dates: [],
    metrics: {}
};

export default function LineChartWidget({ widget, data }: LineChartWidgetProps) {
    const allMetrics: MetricsMap = getAllMetrics();

    // Função auxiliar para combinar dados diários de múltiplas campanhas
    const combineTimelineData = (dailyData: InsightsDaily[]): TimelineData => {
        // Organiza os dados por data
        const dailyMap = new Map<string, Map<string, number>>();
        const allDates = new Set<string>();

        // Processa cada registro diário
        dailyData.forEach(daily => {
            if (!daily.date_start) return;

            allDates.add(daily.date_start);
            const metricsForDate = dailyMap.get(daily.date_start) || new Map<string, number>();

            // Processa métricas básicas
            const impressions = parseFloat(daily.impressions || '0');
            const clicks = parseFloat(daily.clicks || '0');
            const spend = parseFloat(daily.spend || '0');

            metricsForDate.set('impressions', (metricsForDate.get('impressions') || 0) + impressions);
            metricsForDate.set('clicks', (metricsForDate.get('clicks') || 0) + clicks);
            metricsForDate.set('spend', (metricsForDate.get('spend') || 0) + spend);

            // Calcula taxas
            const ctr = clicks && impressions ? (clicks / impressions) * 100 : 0;
            const cpc = clicks && spend ? spend / clicks : 0;
            const cpm = impressions ? (spend / impressions) * 1000 : 0;

            metricsForDate.set('ctr', ctr);
            metricsForDate.set('cpc', cpc);
            metricsForDate.set('cpm', cpm);

            // Processa métricas de ações
            if (daily.actions) {
                daily.actions.forEach(action => {
                    const key = action.action_type.replace(/\./g, '_');
                    const value = parseFloat(action.value || '0');
                    metricsForDate.set(key, (metricsForDate.get(key) || 0) + value);
                });
            }

            dailyMap.set(daily.date_start, metricsForDate);
        });

        // Organiza os resultados
        const sortedDates = Array.from(allDates).sort();
        const result: TimelineData = {
            dates: sortedDates,
            metrics: {}
        };

        // Inicializa as métricas disponíveis
        if (dailyData[0]?.actions) {
            dailyData[0].actions.forEach(action => {
                const key = action.action_type.replace(/\./g, '_');
                result.metrics[key] = [];
            });
        }

        // Adiciona métricas básicas
        ['impressions', 'clicks', 'spend', 'ctr', 'cpc', 'cpm'].forEach(metric => {
            result.metrics[metric] = [];
        });

        // Preenche os valores para cada data
        sortedDates.forEach(date => {
            const metricsForDate = dailyMap.get(date);
            if (!metricsForDate) return;

            Object.keys(result.metrics).forEach(metric => {
                result.metrics[metric].push(metricsForDate.get(metric) || 0);
            });
        });

        return result;
    };

    // Filtra os dados com base no nível e campanhas selecionadas
    let timelineData: TimelineData;

    if (widget.config.level === "account") {
        const accountDaily = data.accounts[0]?.daily;
        if (accountDaily) {
            timelineData = {
                dates: accountDaily.dates,
                metrics: accountDaily.metrics
            };
        } else {
            timelineData = DEFAULT_TIMELINE_DATA;
        }
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

        // Para campanhas, usamos os dados diários filtrados
        const selectedCampaignsDaily = data.daily?.filter(daily =>
            widget.config.campaignIds?.includes(daily.campaign_name) ||
            (widget.config.campaignId && daily.campaign_name === widget.config.campaignId)
        );

        if (!selectedCampaignsDaily?.length) {
            console.log('Sem dados diários disponíveis para as campanhas selecionadas');
            timelineData = DEFAULT_TIMELINE_DATA;
        } else {
            console.log('Processando dados diários das campanhas:', selectedCampaignsDaily);
            timelineData = combineTimelineData(selectedCampaignsDaily);
        }
    }

    const chartData: ChartData<'line'> = {
        labels: timelineData.dates,
        datasets: widget.config.metrics?.map((metricKey: string, index: number) => {
            const metric = allMetrics[metricKey];
            const metricData = timelineData.metrics[metricKey] || [];
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
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label(context) {
                        const value = context.raw as number;
                        const metricKey = widget.config.metrics?.[context.datasetIndex || 0];
                        const metric = metricKey ? allMetrics[metricKey] : null;
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
                        const metric = allMetrics[firstMetric];
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