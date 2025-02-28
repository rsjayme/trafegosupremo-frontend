export interface RawInsightMetrics {
    account_id: string;
    campaign_name: string;
    impressions: string;
    reach: string;
    clicks: string;
    spend: string;
    cpc: string;
    ctr: string;
    cpm: string;
    frequency: string;
    actions: InsightAction[];
    cost_per_action_type: Array<{
        action_type: string;
        value: string;
    }>;
    date_start: string;
    date_stop: string;
}

export interface InsightMetrics {
    impressions: number;
    reach: number;
    clicks: number;
    spend: number;
    cpc: number;
    ctr: number;
    cpm: number;
    frequency: number;
    actions: InsightAction[];
}

export interface InsightAction {
    action_type: string;
    value: number;
}

export interface DailyInsights {
    date: string;
    metrics: InsightMetrics;
}

export interface DemographicInsights {
    demographic_type: 'age' | 'gender' | 'age_gender';
    value: string;
    metrics: Omit<InsightMetrics, 'actions'>;
    percentage?: number;
}

export interface LocationInsights {
    country: string;
    region?: string;
    metrics: Omit<InsightMetrics, 'actions'>;
    percentage?: number;
}

export interface DeviceInsights {
    device_type: string;
    platform: string;
    metrics: Omit<InsightMetrics, 'actions'>;
    percentage?: number;
}

export interface DashboardData {
    overview: InsightMetrics;
    daily: DailyInsights[];
    demographics: DemographicInsights[];
    locations: LocationInsights[];
    devices: DeviceInsights[];
}

export interface DateRange {
    since: string;
    until: string;
}

export interface DashboardFilters extends DateRange {
    brandId: number;
    comparison?: boolean;
}

export interface ComparisonData {
    current: DashboardData;
    previous?: DashboardData;
}