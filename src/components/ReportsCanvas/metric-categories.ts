import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export const METRIC_CATEGORIES = {
    basic: {
        id: "basic",
        label: "Métricas Básicas",
        description: "Métricas fundamentais de desempenho",
        metrics: {
            impressions: { label: "Impressões", format: formatNumber },
            clicks: { label: "Cliques", format: formatNumber },
            spend: { label: "Gasto", format: formatCurrency },
            results: { label: "Resultados", format: formatNumber },
            ctr: { label: "CTR", format: formatPercent },
            cpc: { label: "CPC", format: formatCurrency },
            cpa: { label: "CPA", format: formatCurrency },
        }
    },
    engagement: {
        id: "engagement",
        label: "Métricas de Engajamento",
        description: "Métricas relacionadas à interação com o conteúdo",
        metrics: {
            page_engagement: { label: "Engajamento da Página", format: formatNumber },
            post_engagement: { label: "Engajamento do Post", format: formatNumber },
            comment: { label: "Comentários", format: formatNumber },
            post: { label: "Posts", format: formatNumber },
            post_reaction: { label: "Reações", format: formatNumber },
        }
    },
    messaging: {
        id: "messaging",
        label: "Métricas de Conversação",
        description: "Métricas relacionadas a mensagens e conversas",
        metrics: {
            onsite_conversion_total_messaging_connection: { label: "Conexões de Mensagem", format: formatNumber },
            onsite_conversion_messaging_user_depth_3_message_send: { label: "Mensagens (Profundidade 3)", format: formatNumber },
            onsite_conversion_messaging_first_reply: { label: "Primeiras Respostas", format: formatNumber },
            onsite_conversion_messaging_user_depth_2_message_send: { label: "Mensagens (Profundidade 2)", format: formatNumber },
            onsite_conversion_messaging_conversation_started_7d: { label: "Conversas Iniciadas", format: formatNumber },
        }
    },
    interaction: {
        id: "interaction",
        label: "Métricas de Interação",
        description: "Métricas relacionadas a interações específicas",
        metrics: {
            video_view: { label: "Visualizações de Vídeo", format: formatNumber },
            link_click: { label: "Cliques no Link", format: formatNumber },
        }
    }
} as const;

// Função auxiliar para obter todas as métricas em formato plano (para manter compatibilidade)
export const getAllMetrics = () => {
    return Object.values(METRIC_CATEGORIES).reduce((acc, category) => {
        return { ...acc, ...category.metrics };
    }, {});
};

// Tipos
export type MetricCategory = keyof typeof METRIC_CATEGORIES;
export type MetricDefinition = {
    label: string;
    format: (value: number) => string;
};

// Re-exportar METRICS para manter compatibilidade
export const METRICS = getAllMetrics();