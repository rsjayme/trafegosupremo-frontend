# Implementation Order for Fixes

## Step 1: Base Metrics Implementation

### 1.1 Create MetricCard Component
```tsx
// First, create a reusable card for both base metrics and actions
interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}
```

### 1.2 Update Campaign Display
```tsx
// Show base metrics first, then actions
<div className="space-y-6">
  {/* Base metrics - always visible */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {BASE_METRICS_CONFIG.map(metric => (
      <MetricCard
        key={metric.id}
        label={metric.label}
        value={formatValue(metric.id, campaign[metric.id])}
      />
    ))}
  </div>

  {/* Actions - customizable */}
  {selectedActions.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredActions.map(action => (/* ... */))}
    </div>
  )}
</div>
```

## Step 2: Action Selection Storage

### 2.1 Campaign-Specific Storage
```typescript
// Simple storage structure
interface CampaignActionPreferences {
  [campaignId: string]: string[];
}

const CAMPAIGN_ACTIONS_KEY = 'campaign-actions';
const GLOBAL_ACTIONS_KEY = 'global-actions';
```

### 2.2 Selection Management
```typescript
// Load preferences in order:
// 1. Campaign specific
// 2. Global
// 3. Default
function loadActionPreferences(campaignId: string): string[] {
  try {
    // Try campaign specific
    const campaignPrefs = localStorage.getItem(`${CAMPAIGN_ACTIONS_KEY}-${campaignId}`);
    if (campaignPrefs) return JSON.parse(campaignPrefs);

    // Try global
    const globalPrefs = localStorage.getItem(GLOBAL_ACTIONS_KEY);
    if (globalPrefs) return JSON.parse(globalPrefs);

    // Use default
    return [];
  } catch {
    return [];
  }
}
```

## Step 3: UI Updates

### 3.1 Fix Grid Layout
```tsx
// Remove ScrollArea, use grid with wrapping
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards will naturally wrap */}
</div>
```

### 3.2 Update Text
```typescript
const UI_TEXT = {
  selectMetrics: "Selecionar Métricas",
  noMetrics: "Nenhuma métrica selecionada",
  search: "Buscar métricas",
  apply: "Aplicar",
  cancel: "Cancelar",
  // ...
} as const;
```

## Step 4: Integration Steps

1. Update Components:
   ```typescript
   // 1. Update MetricCard
   // 2. Update grid layouts
   // 3. Update translations
   // 4. Add campaign-specific storage
   ```

2. Test Each Part:
   ```typescript
   // 1. Base metrics display
   // 2. Action selection
   // 3. Grid wrapping
   // 4. Storage persistence
   ```

3. Verify:
   ```typescript
   // 1. Base metrics always show
   // 2. Actions are customizable
   // 3. Layout works on all screens
   // 4. Text is in Portuguese
   ```

## Step 5: Component Updates Order

1. `CampaignMetrics.tsx`:
   - Add base metrics display
   - Fix grid layout
   - Update translations

2. `ActionSelector.tsx`:
   - Update text to Portuguese
   - Add campaign-specific selection

3. `DashboardCampaigns/index.tsx`:
   - Integrate new components
   - Handle storage

## Final Steps

1. Test:
   - Base metrics display correctly
   - Actions are customizable
   - Layout works on all screens
   - Storage works per campaign

2. Verify:
   - All text in Portuguese
   - No horizontal scroll
   - Proper wrapping
   - Consistent spacing

3. Deploy:
   - Migrate existing preferences
   - Update documentation
   - Monitor performance

## Success Criteria

1. Base Metrics:
   - [x] Always visible
   - [x] Proper formatting
   - [x] Correct labels

2. Custom Actions:
   - [x] Per-campaign selection
   - [x] Global defaults
   - [x] Proper storage

3. UI/UX:
   - [x] Portuguese text
   - [x] No horizontal scroll
   - [x] Responsive layout