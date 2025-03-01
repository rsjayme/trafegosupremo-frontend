# Base Metrics Implementation Plan

## 1. Base Metrics Structure

### Constants Definition
```typescript
// front/src/components/DashboardCampaigns/constants.ts
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

export const BASE_METRICS_CONFIG = [
  { id: BASE_METRICS.IMPRESSIONS, label: "Impressões" },
  { id: BASE_METRICS.CLICKS, label: "Cliques" },
  { id: BASE_METRICS.SPEND, label: "Investimento" },
  { id: BASE_METRICS.CPC, label: "CPC" },
  { id: BASE_METRICS.CTR, label: "CTR" },
  { id: BASE_METRICS.CPM, label: "CPM" },
  { id: BASE_METRICS.REACH, label: "Alcance" },
  { id: BASE_METRICS.FREQUENCY, label: "Frequência" }
] as const;
```

## 2. Updated Component Structure

### CampaignMetrics Component
```typescript
// front/src/components/DashboardCampaigns/CampaignMetrics.tsx
interface CampaignMetricsProps {
  campaignId: string;
  campaignName: string;
  accountName: string;
  metrics: {
    // Base metrics
    impressions: string;
    clicks: string;
    spend: string;
    cpc: string;
    ctr: string;
    cpm: string;
    reach: string;
    frequency: string;
    // Custom metrics
    actions: FacebookAction[];
    costPerAction: FacebookAction[];
  };
  selectedActionTypes: string[];
}
```

### Layout Structure
```tsx
<div className="space-y-4">
  {/* Base Metrics - Fixed Grid */}
  <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
    {BASE_METRICS_CONFIG.map(metric => (
      <MetricCard
        key={metric.id}
        label={metric.label}
        value={metrics[metric.id]}
      />
    ))}
  </div>

  {/* Custom Actions - Flexible Grid */}
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
    {filteredActions.map(action => (
      <ActionCard
        key={action.action_type}
        action={action}
        cost={findCostForAction(action)}
      />
    ))}
  </div>
</div>
```

## 3. Storage Strategy

### Global Preferences
```typescript
interface GlobalPreferences {
  selectedActions: string[];
  lastUpdated: string;
}

const GLOBAL_STORAGE_KEY = 'dashboard-global-actions';
```

### Campaign Preferences
```typescript
interface CampaignPreferences {
  campaignId: string;
  selectedActions: string[];
  lastUpdated: string;
}

function getCampaignStorageKey(campaignId: string) {
  return `dashboard-campaign-${campaignId}-actions`;
}
```

## 4. Updated Components

### 1. MetricCard Component
```typescript
interface MetricCardProps {
  label: string;
  value: string;
  variant?: 'base' | 'action';
}

function MetricCard({ label, value, variant = 'base' }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium">{label}</h4>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </Card>
  );
}
```

### 2. ActionCard Component
```typescript
interface ActionCardProps {
  action: FacebookAction;
  cost?: FacebookAction;
}

function ActionCard({ action, cost }: ActionCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <h4 className="text-sm font-medium">{getActionLabel(action.action_type)}</h4>
        <p className="text-lg font-semibold">{formatValue(action.value)}</p>
        {cost && (
          <p className="text-sm text-muted-foreground">
            Custo por ação: {formatCurrency(cost.value)}
          </p>
        )}
      </div>
    </Card>
  );
}
```

## 5. Implementation Steps

1. Create Base Components:
   - MetricCard for fixed metrics
   - ActionCard for custom actions
   - Grid layouts with proper wrapping

2. Update Storage:
   - Add global preferences
   - Add campaign-specific storage
   - Migration for existing data

3. Update UI:
   - Fix translations
   - Improve grid layouts
   - Add loading states

4. Refine Interactions:
   - Global action selection
   - Per-campaign customization
   - Persistence handling

## 6. Portuguese Translations

```typescript
const TRANSLATIONS = {
  metrics: {
    impressions: "Impressões",
    clicks: "Cliques",
    spend: "Investimento",
    cpc: "CPC",
    ctr: "CTR",
    cpm: "CPM",
    reach: "Alcance",
    frequency: "Frequência"
  },
  actions: {
    select: "Selecionar Métricas",
    apply: "Aplicar",
    cancel: "Cancelar",
    search: "Buscar métricas...",
    noResults: "Nenhuma métrica encontrada"
  }
} as const;
```

## 7. Testing Strategy

1. Base Metrics:
   - Verify all base metrics display
   - Check formatting
   - Test responsiveness

2. Custom Actions:
   - Test selection persistence
   - Verify per-campaign storage
   - Check grid wrapping

3. UI/UX:
   - Verify translations
   - Test layout responsiveness
   - Check loading states