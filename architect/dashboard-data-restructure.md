# Dashboard Data Structure Changes

## Summary of Changes
1. Aligned frontend with actual API response structure
2. Removed time series charts as they're not supported by current API
3. Added campaign table with detailed metrics
4. Implemented proper metrics aggregation

## Key Components Updated

### DashboardMetrics
- Now uses aggregate metrics from campaign data
- Shows total spend, reach, impressions, and clicks
- Includes period-over-period comparisons when enabled

### DashboardCampaigns
- New component to display individual campaign performance
- Shows detailed metrics for each campaign
- Supports sorting and pagination through ScrollArea

### Removed Components
- DashboardCharts (removed time series visualizations)
- Time-based metric comparisons
- Daily breakdown charts

## Type Definitions
```typescript
// Main campaign metrics structure from API
interface FacebookCampaignMetrics {
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

// Aggregated metrics for dashboard display
interface AggregatedMetrics {
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
```

## Data Flow
1. API returns array of campaign metrics
2. Service layer aggregates metrics for overview
3. Components display both aggregate and detailed views

## Future Improvements
1. Add campaign filtering
2. Implement metric breakdowns by action type
3. Add export functionality for campaign data
4. Consider adding custom date range presets

## Migration Notes
- The old FacebookContext and useFacebookData hook are now deprecated
- All dashboard data now flows through DashboardService
- Campaign metrics are stored and displayed in their original format
- Aggregation happens on demand rather than at data fetch time