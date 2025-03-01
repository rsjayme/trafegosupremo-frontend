# Simplified Action Selector Implementation

## Overview
Instead of using a context system, we'll implement the action selector directly in the DashboardCampaigns component using local state and localStorage for persistence.

## Implementation Plan

### 1. Add State to DashboardCampaigns

```tsx
// front/src/components/DashboardCampaigns/index.tsx
import { useState, useEffect } from 'react';
import { ActionSelector } from '@/components/ActionSelector';
import { DEFAULT_ACTIONS } from '@/components/ActionSelector/constants';

const STORAGE_KEY = 'dashboard-selected-actions';

function loadSelectedActions(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ACTIONS;
  } catch {
    return DEFAULT_ACTIONS;
  }
}

export function DashboardCampaigns() {
  const [selectedActions, setSelectedActions] = useState<string[]>(() => 
    loadSelectedActions()
  );

  // Persist selections
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedActions));
  }, [selectedActions]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Campanhas</h2>
        <ActionSelector
          selectedActions={selectedActions}
          onSelectionChange={setSelectedActions}
        />
      </div>
      
      {/* Campaign content with filtered actions */}
      <CampaignActions
        actions={actions}
        costPerAction={costPerAction}
        selectedActionTypes={selectedActions}
      />
    </div>
  );
}
```

### 2. Update CampaignActions Component

```tsx
// front/src/components/DashboardCampaigns/CampaignActions.tsx
interface CampaignActionsProps {
  actions: FacebookAction[];
  costPerAction: FacebookAction[];
  selectedActionTypes: string[];
}

export function CampaignActions({
  actions,
  costPerAction,
  selectedActionTypes
}: CampaignActionsProps) {
  // Filter actions based on selection
  const filteredActions = actions.filter(
    action => selectedActionTypes.includes(action.action_type)
  );

  return (
    <div className="grid gap-4">
      {filteredActions.map(action => (
        // Render action metrics
      ))}
    </div>
  );
}
```

## Benefits of This Approach

1. Simpler Implementation
   - No context needed
   - Fewer files to manage
   - Direct state management

2. Easy to Understand
   - Clear data flow
   - Local state
   - Simple persistence

3. Maintainable
   - Everything in one place
   - Easy to modify
   - Easy to debug

## Implementation Steps

1. Update DashboardCampaigns
   - Add state management
   - Add ActionSelector
   - Implement persistence

2. Update CampaignActions
   - Add filtering
   - Update types
   - Handle empty state

3. Test Integration
   - Verify selection works
   - Check persistence
   - Test filtering

## Example Usage

```tsx
// In DashboardCampaigns/index.tsx
function DashboardCampaigns() {
  const [selectedActions, setSelectedActions] = useState<string[]>(() => 
    loadSelectedActions()
  );

  // Campaign data fetching...
  const { data: campaignData } = useDashboardData();

  return (
    <div>
      {/* Header with ActionSelector */}
      <div className="flex justify-between items-center mb-4">
        <h2>Campanhas</h2>
        <ActionSelector
          selectedActions={selectedActions}
          onSelectionChange={setSelectedActions}
        />
      </div>

      {/* Campaign metrics with filtered actions */}
      {campaignData?.map(campaign => (
        <CampaignActions
          key={campaign.id}
          actions={campaign.actions}
          costPerAction={campaign.cost_per_action_type}
          selectedActionTypes={selectedActions}
        />
      ))}
    </div>
  );
}
```

## Migration Strategy

If we need to expand this feature later:

1. Extract state management to a custom hook:
```tsx
function useActionSelection() {
  const [selectedActions, setSelectedActions] = useState<string[]>(() => 
    loadSelectedActions()
  );

  // Add persistence, error handling, etc.

  return { selectedActions, setSelectedActions };
}
```

2. If needed, move to context:
```tsx
// Create context only when needed by multiple components
const ActionSelectionContext = createContext<ReturnType<typeof useActionSelection>>(null);
```

This approach gives us the flexibility to start simple and expand as needed, without overcomplicating the initial implementation.