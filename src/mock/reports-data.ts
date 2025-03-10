import { TimelineData } from '@/types/timeline';
import { InsightsDaily } from '@/services/facebook-insights';

interface Action {
    action_type: string;
    value: string | number;
}

export interface Account {
    id: string;
    name: string;
    metrics: {
        impressions: number;
        clicks: number;
        spend: number;
        results: number;
        ctr: number;
        cpc: number;
        cpa: number;
        cpm: number;
    };
    actions?: Action[];
    demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
    };
    daily: TimelineData;
}

export interface Campaign {
    account_id: string;
    campaign_name: string;
    impressions: string;
    clicks: string;
    spend: string;
    ctr: string;
    cpc: string;
    cpm: string;
    reach: string;
    frequency: string;
    actions?: Action[];
    cost_per_action_type?: Array<{
        action_type: string;
        value: string;
    }>;
    date_start: string;
    date_stop: string;
}

export interface MockData {
    accounts: Account[];
    campaigns: Campaign[];
    daily?: InsightsDaily[];
    since: string;
    until: string;
}

// Mock data inicial com dados de exemplo
export const mockData: MockData = {
    accounts: [
        {
            id: "1",
            name: "Conta Principal",
            metrics: {
                impressions: 150000,
                clicks: 7500,
                spend: 15000,
                results: 300,
                ctr: 5,
                cpc: 2,
                cpa: 50,
                cpm: 100
            },
            demographics: {
                age: {
                    "18-24": 15,
                    "25-34": 35,
                    "35-44": 30,
                    "45-54": 15,
                    "55+": 5,
                },
                gender: {
                    "Masculino": 45,
                    "Feminino": 55,
                },
                location: {
                    "São Paulo": 40,
                    "Rio de Janeiro": 25,
                    "Belo Horizonte": 20,
                    "Outros": 15,
                },
            },
            daily: {
                dates: [],
                metrics: {
                    impressions: [],
                    clicks: [],
                    spend: [],
                    ctr: [],
                    cpc: [],
                    cpm: [],
                    onsite_conversion_messaging_conversation_started_7d: [],
                    onsite_conversion_messaging_first_reply: [],
                    onsite_conversion_messaging_user_depth_2_message_send: [],
                    onsite_conversion_messaging_user_depth_3_message_send: [],
                    onsite_conversion_total_messaging_connection: [],
                    page_engagement: [],
                    post_engagement: [],
                    post_reaction: [],
                    comment: [],
                    link_click: [],
                    video_view: []
                }
            }
        }
    ],
    campaigns: [],
    since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    until: new Date().toISOString()
};