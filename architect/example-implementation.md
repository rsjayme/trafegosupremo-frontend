# Example Implementation

## 1. Base Metrics Card

```tsx
// front/src/components/DashboardCampaigns/MetricCard.tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <Card>
      <div className="p-4 space-y-2">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </Card>
  );
}
```

## 2. Campaign Metrics Display

```tsx
// front/src/components/DashboardCampaigns/CampaignMetrics.tsx
function CampaignMetrics({ campaign, selectedActions }) {
  return (
    <div className="space-y-6">
      {/* Base Metrics - Always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Impressões"
          value={formatNumber(campaign.impressions)}
        />
        <MetricCard 
          label="Cliques"
          value={formatNumber(campaign.clicks)}
        />
        <MetricCard 
          label="Investimento"
          value={formatCurrency(campaign.spend)}
        />
        <MetricCard 
          label="CPC"
          value={formatCurrency(campaign.cpc)}
        />
        <MetricCard 
          label="CTR"
          value={formatPercentage(campaign.ctr)}
        />
        <MetricCard 
          label="CPM"
          value={formatCurrency(campaign.cpm)}
        />
        <MetricCard 
          label="Alcance"
          value={formatNumber(campaign.reach)}
        />
        <MetricCard 
          label="Frequência"
          value={formatNumber(campaign.frequency)}
        />
      </div>

      {/* Custom Actions - If any selected */}
      {selectedActions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaign.actions
            .filter(action => selectedActions.includes(action.action_type))
            .map(action => (
              <MetricCard
                key={action.action_type}
                label={getActionLabel(action.action_type)}
                value={formatNumber(action.value)}
                subtitle={getCostPerAction(action, campaign.cost_per_action_type)}
              />
            ))}
        </div>
      )}
    </div>
  );
}
```

## 3. Dashboard Campaigns

```tsx
// front/src/components/DashboardCampaigns/index.tsx
function DashboardCampaigns({ brandId, since, until }) {
  const { data, isLoading } = useDashboardData({ brandId, since, until });
  
  // Global action selection
  const [globalActions, setGlobalActions] = useState(() => 
    loadGlobalActions()
  );

  // Campaign-specific selections
  const [campaignActions, setCampaignActions] = useState<Record<string, string[]>>(() => 
    loadCampaignActions()
  );

  // Get actions for specific campaign
  const getActionsForCampaign = (campaignId: string) => 
    campaignActions[campaignId] || globalActions;

  return (
    <Card>
      {/* Header with global action selector */}
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Campanhas</h3>
          <p className="text-sm text-muted-foreground">
            {data?.current.length} campanhas ativas
          </p>
        </div>
        <ActionSelector
          selectedActions={globalActions}
          onSelectionChange={setGlobalActions}
        />
      </div>

      {/* Campaign list */}
      <div className="divide-y">
        {data?.current.map(campaign => (
          <div key={campaign.campaign_id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-medium">{campaign.campaign_name}</h4>
                <p className="text-sm text-muted-foreground">
                  {campaign.account_name}
                </p>
              </div>
              <ActionSelector
                selectedActions={getActionsForCampaign(campaign.campaign_id)}
                onSelectionChange={(actions) => {
                  setCampaignActions(prev => ({
                    ...prev,
                    [campaign.campaign_id]: actions
                  }));
                }}
              />
            </div>

            <CampaignMetrics
              campaign={campaign}
              selectedActions={getActionsForCampaign(campaign.campaign_id)}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
```

## 4. Storage Functions

```typescript
// front/src/components/DashboardCampaigns/storage.ts

// Global actions
function loadGlobalActions(): string[] {
  try {
    const stored = localStorage.getItem('global-actions');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Campaign-specific actions
function loadCampaignActions(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem('campaign-actions');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Save preferences
function savePreferences(
  globalActions: string[],
  campaignActions: Record<string, string[]>
) {
  try {
    localStorage.setItem('global-actions', JSON.stringify(globalActions));
    localStorage.setItem('campaign-actions', JSON.stringify(campaignActions));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
}
```

This implementation:
1. Always shows base metrics
2. Allows global and per-campaign action selection
3. Uses proper grid layout with wrapping
4. Uses Portuguese text
5. Keeps it simple and focused