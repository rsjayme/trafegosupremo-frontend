# Implementation First Steps

## 1. Create Dashboard Actions Context

First, let's create the context structure:

1. Create folder structure:
```
front/src/contexts/DashboardActions/
├── index.ts
├── types.ts
├── context.tsx
└── storage.ts
```

2. Implementation order:
   - Types
   - Context
   - Storage
   - Integration

## 2. Quick Implementation Plan

### Step 1: Create Basic Context

```typescript
// front/src/contexts/DashboardActions/types.ts
export interface DashboardActionsState {
  selectedActions: string[];
}

// front/src/contexts/DashboardActions/context.tsx
import { createContext, useContext, useState } from 'react';
import { DashboardActionsState } from './types';

const DashboardActionsContext = createContext<DashboardActionsState | null>(null);

export function DashboardActionsProvider({ children }) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  
  return (
    <DashboardActionsContext.Provider value={{ selectedActions }}>
      {children}
    </DashboardActionsProvider>
  );
}
```

### Step 2: Add to Dashboard Layout

```tsx
// front/src/app/(authenticated)/layout.tsx
import { DashboardActionsProvider } from '@/contexts/DashboardActions';

export default function DashboardLayout({ children }) {
  return (
    <DashboardActionsProvider>
      {children}
    </DashboardActionsProvider>
  );
}
```

### Step 3: Add Action Selector to Dashboard Header

```tsx
// front/src/components/DashboardCampaigns/index.tsx
import { ActionSelector } from '@/components/ActionSelector';
import { useDashboardActions } from '@/contexts/DashboardActions';

export function DashboardCampaigns() {
  const { selectedActions, setSelectedActions } = useDashboardActions();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2>Campanhas</h2>
        <ActionSelector
          selectedActions={selectedActions}
          onSelectionChange={setSelectedActions}
        />
      </div>
      {/* Rest of the component */}
    </div>
  );
}
```

## 3. Test Integration

1. Basic integration test:
```tsx
// front/src/components/DashboardCampaigns/index.test.tsx
import { render, screen } from '@testing-library/react';
import { DashboardCampaigns } from './index';

describe('DashboardCampaigns', () => {
  it('renders action selector', () => {
    render(<DashboardCampaigns />);
    expect(screen.getByText('Select Metrics')).toBeInTheDocument();
  });
});
```

## 4. Next Implementation Steps

1. Add actions filtering:
```tsx
function CampaignActions({ actions }) {
  const { selectedActions } = useDashboardActions();
  
  const filteredActions = actions.filter(
    action => selectedActions.includes(action.type)
  );

  return (
    <div>
      {filteredActions.map(action => (
        // Render filtered actions
      ))}
    </div>
  );
}
```

2. Add persistence:
```typescript
// front/src/contexts/DashboardActions/storage.ts
const STORAGE_KEY = 'dashboard-selected-actions';

export function saveSelectedActions(actions: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
}

export function loadSelectedActions(): string[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}
```

## 5. Quick Start Steps

1. Create context files:
```bash
mkdir -p front/src/contexts/DashboardActions
touch front/src/contexts/DashboardActions/{index.ts,types.ts,context.tsx,storage.ts}
```

2. Add basic implementations:
```bash
# Copy the code snippets above to their respective files
```

3. Update Dashboard component:
```bash
# Add ActionSelector to DashboardCampaigns/index.tsx
```

4. Test integration:
```bash
npm test
```

## 6. Verification Steps

1. Visual Check:
   - ActionSelector appears in dashboard header
   - Selected actions are highlighted
   - Selection persists on refresh

2. Functional Check:
   - Selecting actions updates the display
   - Actions are properly filtered
   - State persists between page loads

3. Performance Check:
   - No noticeable lag on selection
   - Smooth transitions
   - No unnecessary re-renders

## 7. Expected Result

After implementation, you should see:

1. Action Selector button in the dashboard header
2. Clicking it opens the selection dialog
3. Selecting actions updates the displayed metrics
4. Selection persists between page reloads

## 8. Fallback Plan

If issues arise:

1. Revert to showing all actions
2. Add error boundaries
3. Add loading states
4. Log selection changes

## 9. Next Steps

After basic integration:

1. Add loading states
2. Improve error handling
3. Add analytics
4. Optimize performance
5. Add tests
6. Update documentation