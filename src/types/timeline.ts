export interface TimelineMetrics {
    [key: string]: number[];
}

export interface TimelineData {
    dates: string[];
    metrics: TimelineMetrics;
}

export type TimelineMetricKey =
    | 'impressions'
    | 'clicks'
    | 'spend'
    | 'ctr'
    | 'cpc'
    | 'cpm'
    // Métricas de ações
    | 'onsite_conversion_messaging_conversation_started_7d'
    | 'onsite_conversion_messaging_first_reply'
    | 'onsite_conversion_messaging_user_depth_2_message_send'
    | 'onsite_conversion_messaging_user_depth_3_message_send'
    | 'onsite_conversion_total_messaging_connection'
    | 'page_engagement'
    | 'post_engagement'
    | 'post_reaction'
    | 'comment'
    | 'link_click'
    | 'video_view'
    | string; // Permite métricas dinâmicas