// Métricas base com labels em português
export const BASE_METRIC_LABELS: Record<string, string> = {
    impressions: "Impressões",
    clicks: "Cliques",
    spend: "Investimento",
    cpc: "CPC",
    ctr: "CTR",
    cpm: "CPM",
    reach: "Alcance",
    frequency: "Frequência"
};

// Labels para métricas de ação do Facebook
export const ACTION_LABELS: Record<string, string> = {
    // Métricas de mensagens
    "onsite_conversion.messaging_first_reply": "Primeiras Respostas",
    "onsite_conversion.messaging_conversation_started_7d": "Conversas Iniciadas",
    "onsite_conversion.messaging_block": "Bloqueios de Mensagem",
    "onsite_conversion.messaging_user_depth_2_message_send": "Mensagens (Nível 2)",
    "onsite_conversion.messaging_user_depth_3_message_send": "Mensagens (Nível 3)",
    "onsite_conversion.messaging_welcome_message_view": "Visualizações de Boas-vindas",
    "onsite_conversion.total_messaging_connection": "Conexões de Mensagem",

    // Métricas de engajamento
    "post_engagement": "Engajamento com Post",
    "page_engagement": "Engajamento com Página",
    "post_reaction": "Reações",
    "comment": "Comentários",
    "post": "Posts",
    "onsite_conversion.post_save": "Posts Salvos",

    // Métricas de interação
    "link_click": "Cliques em Link",
    "video_view": "Visualizações de Vídeo"
};

// Função auxiliar para obter o label de qualquer métrica
export function getMetricLabel(metricId: string): string {
    // Primeiro tenta métricas base
    if (metricId in BASE_METRIC_LABELS) {
        return BASE_METRIC_LABELS[metricId];
    }

    // Depois tenta métricas de ação
    if (metricId in ACTION_LABELS) {
        return ACTION_LABELS[metricId];
    }

    // Se não encontrar, retorna o ID formatado
    return metricId
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Formata o label de custo por ação
export function getCostPerActionLabel(actionType: string): string {
    const actionLabel = getMetricLabel(actionType);
    return `Custo por ${actionLabel.toLowerCase()}`;
}