# Action Selector Fixes

## 1. Base Metrics Implementation

### Fixed Base Metrics
```typescript
export const BASE_METRICS = {
  IMPRESSIONS: "impressions",
  CLICKS: "clicks",
  SPEND: "spend",
  CPC: "cpc",
  CTR: "ctr",
  CPM: "cpm",
  REACH: "reach",
  FREQUENCY: "frequency"
} as const;

// These metrics will always be displayed and cannot be disabled
export const BASE_METRICS_CONFIG = [
  { id: BASE_METRICS.IMPRESSIONS, label: "Impressões" },
  { id: BASE_METRICS.CLICKS, label: "Cliques" },
  { id: BASE_METRICS.SPEND, label: "Investimento" },
  { id: BASE_METRICS.CPC, label: "CPC" },
  { id: BASE_METRICS.CTR, label: "CTR" },
  { id: BASE_METRICS.CPM, label: "CPM" },
  { id: BASE_METRICS.REACH, label: "Alcance" },
  { id: BASE_METRICS.FREQUENCY, label: "Frequência" }
];
```

## 2. Campaign-Specific Action Selection

### Update CampaignMetrics Component
```typescript
interface CampaignMetricsProps {
  campaignId: string;
  // ... other props
}

// Allow per-campaign action selection
const STORAGE_KEY_PREFIX = 'campaign-actions';

function getCampaignStorageKey(campaignId: string) {
  return `${STORAGE_KEY_PREFIX}-${campaignId}`;
}
```

## 3. Fix Card Layout

### Update Grid Layout
```tsx
// Replace ScrollArea with grid layout
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {/* Base Metrics - Always shown */}
  {BASE_METRICS_CONFIG.map(metric => (
    <MetricCard key={metric.id} {...metric} />
  ))}
  
  {/* Selected Actions - Optional */}
  {filteredActions.map(action => (
    <MetricCard key={action.id} {...action} />
  ))}
</div>
```

## Simple Implementation Steps

1. Update Constants:
```typescript
// Add base metrics
// Add Portuguese translations
// Separate fixed and optional metrics
```

2. Update CampaignMetrics:
```typescript
// Always show base metrics first
// Allow campaign-specific action selection
// Fix grid layout to wrap properly
```

3. Update Storage:
```typescript
// Global action preferences
localStorage.setItem('global-actions', actions)

// Campaign-specific preferences
localStorage.setItem(`campaign-${id}-actions`, actions)
```

4. Update UI Text:
```typescript
// Replace English text with Portuguese
"Select Actions" -> "Selecionar Métricas"
"Search" -> "Buscar"
"Apply" -> "Aplicar"
```

## Component Changes

### 1. DashboardCampaigns
- Display base metrics for all campaigns
- Allow campaign-specific action selection
- Fix grid layout wrapping

### 2. CampaignMetrics
- Split into BaseMetrics and CustomMetrics
- Fix horizontal overflow
- Use proper translations

### 3. ActionSelector
- Allow global and per-campaign selection
- Use Portuguese text
- Improve grid layout

## Simple Storage Structure
```typescript
interface MetricPreferences {
  // Global preferences
  globalActions: string[];
  
  // Campaign-specific preferences
  campaignActions: {
    [campaignId: string]: string[];
  };
}
```

## Implementation Priority

1. Base Metrics Display
   - Add fixed metrics
   - Proper translations
   - Grid layout fix

2. Per-Campaign Selection
   - Campaign storage
   - Individual preferences
   - Global defaults

3. UI Improvements
   - Fix text
   - Fix layout
   - Improve usability

Keep it simple and focused on these specific requirements.