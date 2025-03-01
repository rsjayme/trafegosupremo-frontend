export const ACTION_TYPES = {
    // Messaging actions
    FIRST_REPLY: "onsite_conversion.messaging_first_reply",
    CONVERSATION_STARTED: "onsite_conversion.messaging_conversation_started_7d",
    MESSAGE_BLOCK: "onsite_conversion.messaging_block",
    MESSAGE_LEVEL_2: "onsite_conversion.messaging_user_depth_2_message_send",
    MESSAGE_LEVEL_3: "onsite_conversion.messaging_user_depth_3_message_send",
    WELCOME_MESSAGE: "onsite_conversion.messaging_welcome_message_view",
    MESSAGE_CONNECTION: "onsite_conversion.total_messaging_connection",

    // Engagement actions
    POST_ENGAGEMENT: "post_engagement",
    PAGE_ENGAGEMENT: "page_engagement",
    POST_REACTION: "post_reaction",
    COMMENT: "comment",
    POST: "post",
    POST_SAVE: "onsite_conversion.post_save",

    // Interaction actions
    LINK_CLICK: "link_click",
    VIDEO_VIEW: "video_view"
} as const;

export const CATEGORIES = {
    MESSAGING: "messaging",
    ENGAGEMENT: "engagement",
    INTERACTION: "interaction"
} as const;

export const CATEGORY_DEFINITIONS = [
    {
        id: CATEGORIES.MESSAGING,
        label: "Mensagens",
        description: "Métricas relacionadas a mensagens e conversas"
    },
    {
        id: CATEGORIES.ENGAGEMENT,
        label: "Engajamento",
        description: "Métricas de engajamento com conteúdo"
    },
    {
        id: CATEGORIES.INTERACTION,
        label: "Interação",
        description: "Métricas de interação com mídia e links"
    }
];

export const ACTION_DEFINITIONS = [
    {
        id: ACTION_TYPES.FIRST_REPLY,
        label: "Primeira Resposta",
        category: CATEGORIES.MESSAGING,
        description: "Primeiras respostas em conversas"
    },
    {
        id: ACTION_TYPES.CONVERSATION_STARTED,
        label: "Conversas Iniciadas",
        category: CATEGORIES.MESSAGING,
        description: "Novas conversas iniciadas nos últimos 7 dias"
    },
    {
        id: ACTION_TYPES.MESSAGE_BLOCK,
        label: "Bloqueios de Mensagem",
        category: CATEGORIES.MESSAGING,
        description: "Mensagens bloqueadas pelo usuário"
    },
    {
        id: ACTION_TYPES.MESSAGE_LEVEL_2,
        label: "Mensagens (Nível 2)",
        category: CATEGORIES.MESSAGING,
        description: "Mensagens com profundidade de interação nível 2"
    },
    {
        id: ACTION_TYPES.MESSAGE_LEVEL_3,
        label: "Mensagens (Nível 3)",
        category: CATEGORIES.MESSAGING,
        description: "Mensagens com profundidade de interação nível 3"
    },
    {
        id: ACTION_TYPES.WELCOME_MESSAGE,
        label: "Visualizações de Boas-vindas",
        category: CATEGORIES.MESSAGING,
        description: "Visualizações da mensagem de boas-vindas"
    },
    {
        id: ACTION_TYPES.MESSAGE_CONNECTION,
        label: "Conexões de Mensagem",
        category: CATEGORIES.MESSAGING,
        description: "Total de conexões por mensagem"
    },
    {
        id: ACTION_TYPES.POST_ENGAGEMENT,
        label: "Engajamento com Post",
        category: CATEGORIES.ENGAGEMENT,
        description: "Total de engajamentos em posts"
    },
    {
        id: ACTION_TYPES.PAGE_ENGAGEMENT,
        label: "Engajamento com Página",
        category: CATEGORIES.ENGAGEMENT,
        description: "Total de engajamentos na página"
    },
    {
        id: ACTION_TYPES.POST_REACTION,
        label: "Reações",
        category: CATEGORIES.ENGAGEMENT,
        description: "Reações em posts"
    },
    {
        id: ACTION_TYPES.COMMENT,
        label: "Comentários",
        category: CATEGORIES.ENGAGEMENT,
        description: "Comentários em posts"
    },
    {
        id: ACTION_TYPES.POST,
        label: "Posts",
        category: CATEGORIES.ENGAGEMENT,
        description: "Total de posts"
    },
    {
        id: ACTION_TYPES.POST_SAVE,
        label: "Posts Salvos",
        category: CATEGORIES.ENGAGEMENT,
        description: "Posts salvos pelos usuários"
    },
    {
        id: ACTION_TYPES.LINK_CLICK,
        label: "Cliques em Link",
        category: CATEGORIES.INTERACTION,
        description: "Cliques em links"
    },
    {
        id: ACTION_TYPES.VIDEO_VIEW,
        label: "Visualizações de Vídeo",
        category: CATEGORIES.INTERACTION,
        description: "Visualizações de vídeos"
    }
];

export const DEFAULT_ACTIONS = [
    ACTION_TYPES.POST_ENGAGEMENT,
    ACTION_TYPES.PAGE_ENGAGEMENT,
    ACTION_TYPES.LINK_CLICK,
    ACTION_TYPES.VIDEO_VIEW,
    ACTION_TYPES.FIRST_REPLY
];