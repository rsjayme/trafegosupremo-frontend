import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface FunnelChartWidgetProps {
    widget: Widget;
    data: MockData;
}

const METRICS = {
    impressions: { label: "Impressões", format: formatNumber },
    clicks: { label: "Cliques", format: formatNumber },
    spend: { label: "Gasto", format: formatCurrency },
    results: { label: "Resultados", format: formatNumber },
    ctr: { label: "CTR", format: formatPercent },
    cpc: { label: "CPC", format: formatCurrency },
    cpa: { label: "CPA", format: formatCurrency },
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

const COLORS = [
    'rgba(54, 162, 235, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(255, 206, 86, 0.8)',
];

export default function FunnelChartWidget({ widget, data }: FunnelChartWidgetProps) {
    // Filtra os itens com base no nível e campanhas selecionadas
    const items = widget.config.level === "account"
        ? data.accounts
        : widget.config.campaignIds?.length
            ? data.campaigns.filter(campaign => widget.config.campaignIds?.includes(campaign.campaign_name))
            : widget.config.campaignId
                ? data.campaigns.filter(campaign => campaign.campaign_name === widget.config.campaignId)
                : data.campaigns;

    // Agrega métricas de todos os itens selecionados
    const aggregatedMetrics = items.reduce(
        (acc: Record<string, number>, item) => {
            const currentMetrics = { ...acc };

            if ("metrics" in item) {
                // Se for Account, pega métricas do objeto metrics
                const metrics = item.metrics;
                Object.keys(metrics).forEach(key => {
                    currentMetrics[key] = (currentMetrics[key] || 0) + metrics[key as keyof typeof metrics];
                });
            } else {
                // Se for Campaign, pega métricas direto do objeto
                currentMetrics.impressions = (acc.impressions || 0) + parseFloat(item.impressions || '0');
                currentMetrics.clicks = (acc.clicks || 0) + parseFloat(item.clicks || '0');
                currentMetrics.spend = (acc.spend || 0) + parseFloat(item.spend || '0');
            }

            // Métricas de ações
            if (item.actions) {
                item.actions.forEach(action => {
                    const actionKey = action.action_type.replace(/\./g, '_');
                    currentMetrics[actionKey] = (currentMetrics[actionKey] || 0) + Number(action.value);
                });
            }

            return currentMetrics;
        },
        {}
    );

    // Prepara dados para o funil
    const funnelData = widget.config.funnelMetrics?.map((metricKey, index) => {
        const metric = METRICS[metricKey as keyof typeof METRICS];
        const value = aggregatedMetrics[metricKey] || 0;
        return {
            value,
            formattedValue: metric ? metric.format(value) : value.toString(),
            label: metric ? metric.label : metricKey,
            color: COLORS[index] || COLORS[0]
        };
    }) || [];

    // Calcula porcentagens de conversão entre etapas
    const conversionRates = funnelData.slice(1).map((curr, index) => {
        const prev = funnelData[index];
        return prev.value > 0 ? (curr.value / prev.value) * 100 : 0;
    });

    // Configuração do gráfico
    const options = {
        chart: {
            type: 'bar' as const,
            toolbar: {
                show: false
            },
            stacked: true
        },
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '80%',
                distributed: true
            }
        },
        colors: funnelData.map(d => d.color),
        title: {
            text: widget.title,
            align: 'center' as const
        },
        xaxis: {
            categories: funnelData.map(d => d.label),
            labels: {
                show: true,
                style: {
                    colors: '#777'
                }
            }
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (value: number, { dataPointIndex }: { dataPointIndex: number }) {
                const formattedValue = funnelData[dataPointIndex].formattedValue;
                if (dataPointIndex > 0) {
                    const conversionRate = conversionRates[dataPointIndex - 1];
                    return `${formattedValue} (${formatPercent(conversionRate)} taxa de conversão)`;
                }
                return formattedValue;
            },
            style: {
                fontSize: '14px'
            }
        },
        legend: {
            show: false
        },
        tooltip: {
            enabled: false
        }
    };

    const series = [{
        name: 'Valor',
        data: funnelData.map(d => d.value)
    }];

    return (
        <div className="h-[400px] w-full p-4">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={380}
            />
        </div>
    );
}