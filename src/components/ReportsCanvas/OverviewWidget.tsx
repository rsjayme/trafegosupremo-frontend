import { Widget } from "@/app/(authenticated)/relatorios/page";
import { MockData } from "@/mock/reports-data";
import { METRICS } from "./metrics";

interface OverviewWidgetProps {
    widget: Widget;
    data: MockData;
}

// Função para normalizar as chaves das métricas (substituir pontos por underscores)
function normalizeMetricKey(key: string): string {
    return key.replace(/\./g, '_');
}

export default function OverviewWidget({ widget, data }: OverviewWidgetProps) {
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
                const metric = METRICS[normalizedKey as keyof typeof METRICS];

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