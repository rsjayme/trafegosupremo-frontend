import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

export const METRICS = {
    // Métricas básicas
    impressions: { label: "Impressões", format: formatNumber },
    clicks: { label: "Cliques", format: formatNumber },
    spend: { label: "Gasto", format: formatCurrency },
    results: { label: "Resultados", format: formatNumber },
    ctr: { label: "CTR", format: formatPercent },
    cpc: { label: "CPC", format: formatCurrency },
    cpa: { label: "CPA", format: formatCurrency },
    // Métricas de ações
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

export type MetricKey = keyof typeof METRICS;