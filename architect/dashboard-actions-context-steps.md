# DashboardActionsContext Implementation Guide

## Step 1: Create Types

Create `front/src/contexts/DashboardActionsContext/types.ts`:
```typescript
export interface DashboardActionsState {
  selectedActions: string[];
  expandedCategories: string[];
  defaultActions: string[];
  lastUpdated: string;
}

export interface DashboardActionsContextValue {
  // State
  selectedActions: Set<string>;
  expandedCategories: Set<string>;
  
  // Actions
  selectActions: (actions: string[]) => void;
  toggleAction: (actionId: string) => void;
  toggleCategory: (categoryId: string) => void;
  resetToDefault: () => void;
  
  // Status
  isLoading: boolean;
  error: Error | null;
}

export interface DashboardActionsProviderProps {
  children: React.ReactNode;
  initialActions?: string[];
}
```

## Step 2: Create Storage Service

Create `front/src/contexts/DashboardActionsContext/storage.ts`:
```typescript
import { DashboardActionsState } from './types';
import { DEFAULT_ACTIONS } from '@/components/ActionSelector';

const STORAGE_KEY = 'dashboard-actions-state';

export const storage = {
  load(): DashboardActionsState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load dashboard actions state:', error);
    }

    return {
      selectedActions: DEFAULT_ACTIONS,
      expandedCategories: [],
      defaultActions: DEFAULT_ACTIONS,
      lastUpdated: new Date().toISOString()
    };
  },

  save(state: DashboardActionsState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save dashboard actions state:', error);
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear dashboard actions state:', error);
    }
  }
};
```

## Step 3: Create Context

Create `front/src/contexts/DashboardActionsContext/context.tsx`:
```typescript
import * as React from 'react';
import { DashboardActionsContextValue } from './types';

export const DashboardActionsContext = React.createContext<DashboardActionsContextValue | null>(null);

if (process.env.NODE_ENV !== 'production') {
  DashboardActionsContext.displayName = 'DashboardActionsContext';
}
```

## Step 4: Create Provider

Create `front/src/contexts/DashboardActionsContext/provider.tsx`:
```typescript
import * as React from 'react';
import { DashboardActionsContext } from './context';
import { storage } from './storage';
import type { DashboardActionsProviderProps } from './types';

export function DashboardActionsProvider({
  children,
  initialActions
}: DashboardActionsProviderProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  const [state, setState] = React.useState(() => {
    try {
      const stored = storage.load();
      return {
        selectedActions: new Set(stored.selectedActions),
        expandedCategories: new Set(stored.expandedCategories)
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load state'));
      return {
        selectedActions: new Set(initialActions),
        expandedCategories: new Set()
      };
    }
  });

  React.useEffect(() => {
    setIsLoading(false);
  }, []);

  const contextValue = React.useMemo(() => ({
    // State
    selectedActions: state.selectedActions,
    expandedCategories: state.expandedCategories,
    
    // Actions
    selectActions: (actions: string[]) => {
      setState(prev => ({
        ...prev,
        selectedActions: new Set(actions)
      }));
      
      storage.save({
        selectedActions: actions,
        expandedCategories: Array.from(state.expandedCategories),
        defaultActions: initialActions || [],
        lastUpdated: new Date().toISOString()
      });
    },

    toggleAction: (actionId: string) => {
      setState(prev => {
        const newSet = new Set(prev.selectedActions);
        if (newSet.has(actionId)) {
          newSet.delete(actionId);
        } else {
          newSet.add(actionId);
        }
        return {
          ...prev,
          selectedActions: newSet
        };
      });
    },

    toggleCategory: (categoryId: string) => {
      setState(prev => {
        const newSet = new Set(prev.expandedCategories);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }
        return {
          ...prev,
          expandedCategories: newSet
        };
      });
    },

    resetToDefault: () => {
      setState(prev => ({
        ...prev,
        selectedActions: new Set(initialActions)
      }));
    },

    // Status
    isLoading,
    error
  }), [state, isLoading, error, initialActions]);

  return (
    <DashboardActionsContext.Provider value={contextValue}>
      {children}
    </DashboardActionsContext.Provider>
  );
}
```

## Step 5: Create Hook

Create `front/src/contexts/DashboardActionsContext/hook.ts`:
```typescript
import * as React from 'react';
import { DashboardActionsContext } from './context';

export function useDashboardActions() {
  const context = React.useContext(DashboardActionsContext);
  
  if (!context) {
    throw new Error('useDashboardActions must be used within DashboardActionsProvider');
  }
  
  return context;
}
```

## Step 6: Create Index File

Create `front/src/contexts/DashboardActionsContext/index.ts`:
```typescript
export * from './context';
export * from './provider';
export * from './hook';
export * from './types';
```

## Integration Example

```tsx
// In your app layout or page component:
import { DashboardActionsProvider } from '@/contexts/DashboardActionsContext';
import { DEFAULT_ACTIONS } from '@/components/ActionSelector';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardActionsProvider initialActions={DEFAULT_ACTIONS}>
      {children}
    </DashboardActionsProvider>
  );
}

// In your components:
import { useDashboardActions } from '@/contexts/DashboardActionsContext';

export function DashboardMetrics() {
  const { selectedActions, toggleAction } = useDashboardActions();
  
  // Use the context values and actions
}