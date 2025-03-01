// Mapeamento de action_type para labels em português
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

// Função auxiliar para obter o label de uma action
export function getActionLabel(actionType: string): string {
    return ACTION_LABELS[actionType] || actionType;
}