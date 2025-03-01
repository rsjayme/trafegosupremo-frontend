export interface DashboardFilters {
    brandId: number;
    since: string;
    until: string;
}

export interface FacebookAction {
    action_type: string;
    value: string;
}

export interface FacebookCampaignMetrics {
    account_id: string;
    account_name: string;
    campaign_id: string;
    campaign_name: string;

    // Base metrics (always visible)
    impressions: string;
    clicks: string;
    spend: string;
    cpc: string;
    ctr: string;
    cpm: string;
    reach: string;
    frequency: string;

    // Action metrics (customizable)
    actions: FacebookAction[];
    cost_per_action_type: FacebookAction[];
}

export interface DashboardData {
    current: FacebookCampaignMetrics[];
    previous: FacebookCampaignMetrics[];
}

export interface DashboardMetric {
    current: number;
    previous: number;
    difference: number;
    percentageDiff: number;
}

export interface DashboardMetrics {
    spend: DashboardMetric;
    actions: Record<string, DashboardMetric>;
    costPerAction: Record<string, DashboardMetric>;
}