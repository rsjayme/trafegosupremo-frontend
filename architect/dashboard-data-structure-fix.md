# Dashboard Data Structure Fix Plan

## Current Issues
1. Frontend assumes daily data when API provides campaign-level aggregates
2. Charts showing time-series data are invalid
3. Types don't match API response structure
4. Metrics calculations need to be adjusted for campaign aggregation

## Required Changes

### 1. Update Types
```typescript
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
    actions: Array<{
        action_type: string;
        value: string;
    }>;
    cost_per_action_type: Array<{
        action_type: string;
        value: string;
    }>;
    date_start: string;
    date_stop: string;
}
```

### 2. Component Changes
1. Remove:
   - DashboardCharts (no daily data available)
   - TimeSeriesCharts
   - Any components assuming daily data

2. Add:
   - CampaignOverviewTable
   - CampaignMetricsSummary
   - ActionTypeBreakdown

### 3. Dashboard Layout
1. Metrics Overview (totals/averages across campaigns)
   - Total Spend
   - Total Reach
   - Total Impressions
   - Average CTR
   - Average CPC
   - Average Frequency

2. Campaign Table
   - List all campaigns with metrics
   - Sortable columns
   - Campaign name and status

3. Actions Summary
   - Group and sum actions by type
   - Show cost per action type

## Implementation Steps

1. Backend Integration
   - Update service to handle campaign-level data
   - Add proper data aggregation functions
   - Update types and interfaces

2. UI Components
   - Create new campaign-focused components
   - Remove time-series visualizations
   - Add proper loading states

3. Data Processing
   - Add utility functions for metric calculations
   - Implement proper aggregation logic
   - Handle string to number conversions

4. Testing
   - Verify calculations match Facebook data
   - Test edge cases with missing data
   - Validate display formats