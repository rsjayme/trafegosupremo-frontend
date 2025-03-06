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
import { METRICS, MetricKey } from "./metrics";

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

const DEFAULT_TIMELINE_DATA: TimelineData = {
    dates: [],
    metrics: {}
};

export default function LineChartWidget({ widget, data }: LineChartWidgetProps) {
    // Função auxiliar para combinar dados diários de múltiplas campanhas
    const combineTimelineData = (campaigns: InsightsDaily[]): TimelineData => {
        const allDates = new Set<string>();
        const metricsMap = new Map<string, Map<string, number>>();

        // Cria um objeto para armazenar todas as métricas disponíveis
        const availableMetrics = new Set<string>();

        // Coleta todas as datas e métricas disponíveis
        campaigns.forEach(campaign => {
            if (campaign.date_start) {
                allDates.add(campaign.date_start);

                // Adiciona métricas básicas
                availableMetrics.add('impressions');
                availableMetrics.add('clicks');
                availableMetrics.add('spend');
                availableMetrics.add('ctr');
                availableMetrics.add('cpc');
                availableMetrics.add('cpm');

                // Adiciona métricas de actions
                campaign.actions?.forEach(action => {
                    const key = action.action_type.replace(/\./g, '_');
                    availableMetrics.add(key);
                });
            }
        });

        // Inicializa o mapa de métricas por data
        const sortedDates = Array.from(allDates).sort();
        sortedDates.forEach(date => {
            metricsMap.set(date, new Map<string, number>());
        });

        // Soma todas as métricas por data
        campaigns.forEach(campaign => {
            if (campaign.date_start) {
                const dailyMetrics = metricsMap.get(campaign.date_start)!;

                // Soma métricas básicas
                const impressions = parseFloat(campaign.impressions || '0');
                const clicks = parseFloat(campaign.clicks || '0');
                const spend = parseFloat(campaign.spend || '0');

                dailyMetrics.set('impressions', (dailyMetrics.get('impressions') || 0) + impressions);
                dailyMetrics.set('clicks', (dailyMetrics.get('clicks') || 0) + clicks);
                dailyMetrics.set('spend', (dailyMetrics.get('spend') || 0) + spend);

                // Calcula taxas
                dailyMetrics.set('ctr', clicks && impressions ? (clicks / impressions) * 100 : 0);
                dailyMetrics.set('cpc', clicks && spend ? spend / clicks : 0);
                dailyMetrics.set('cpm', impressions ? (spend / impressions) * 1000 : 0);

                // Soma métricas de actions
                campaign.actions?.forEach(action => {
                    const key = action.action_type.replace(/\./g, '_');
                    const value = typeof action.value === 'string' ? parseFloat(action.value) : Number(action.value);
                    dailyMetrics.set(key, (dailyMetrics.get(key) || 0) + value);
                });
            }
        });

        // Prepara o resultado final
        const result: TimelineData = {
            dates: sortedDates,
            metrics: {}
        };

        // Inicializa arrays para cada métrica
        availableMetrics.forEach(metric => {
            result.metrics[metric] = [];
        });

        // Preenche os valores para cada métrica em cada data
        sortedDates.forEach(date => {
            const dailyMetrics = metricsMap.get(date)!;
            availableMetrics.forEach(metric => {
                if (metric in result.metrics) {
                    result.metrics[metric].push(dailyMetrics.get(metric) || 0);
                }
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

        timelineData = combineTimelineData(selectedCampaigns as InsightsDaily[]);
    }

    const chartData: ChartData<'line'> = {
        labels: timelineData.dates,
        datasets: widget.config.metrics?.map((metricKey: string, index: number) => {
            const metric = METRICS[metricKey as MetricKey];
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
                        const metric = METRICS[widget.config.metrics?.[context.datasetIndex || 0] as MetricKey];
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
                        const metric = METRICS[firstMetric as MetricKey];
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