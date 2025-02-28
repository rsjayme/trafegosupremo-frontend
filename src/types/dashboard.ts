export interface FacebookAction {
    action_type: string;
    value: string;
}

export interface FacebookCampaignMetrics {
    account_id: string;
    campaign_name: string;
    impressions: string;
    clicks: string;
    spend: string;
    cpc: string;
    ctr: string;
    cpm: string;
    reach: string;
    frequency: string;
    actions: FacebookAction[];
    cost_per_action_type: FacebookAction[];
    date_start: string;
    date_stop: string;
}

export interface DashboardData {
    current: FacebookCampaignMetrics[];
    previous?: FacebookCampaignMetrics[];
}

export interface DashboardFilters {
    brandId: number;
    since: string;
    until: string;
    comparison?: boolean;
}

export interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

// Utility types for aggregated data
export interface AggregatedMetrics {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    ctr: number;
    cpc: number;
    cpm: number;
    frequency: number;
    actions: {
        type: string;
        value: number;
        cost: number;
    }[];
}