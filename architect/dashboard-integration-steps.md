# Dashboard Integration Steps

## Step 1: Create Dashboard Context

1. Create new file: `front/src/contexts/DashboardActionsContext.tsx`
   - Implement context provider
   - Add state management
   - Handle persistence

2. Update Dashboard layout
   - Wrap with provider
   - Add error boundaries

## Step 2: Add to Dashboard Header

1. Update `front/src/components/DashboardCampaigns/index.tsx`:
```tsx
import { ActionSelector } from "@/components/ActionSelector";
import { useDashboardActions } from "@/contexts/DashboardActionsContext";

function DashboardCampaigns() {
  const { selectedActions, setSelectedActions } = useDashboardActions();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2>Campanhas</h2>
        <ActionSelector
          selectedActions={selectedActions}
          onSelectionChange={setSelectedActions}
        />
      </div>
      {/* Rest of campaigns component */}
    </div>
  );
}
```

## Step 3: Filter Campaign Actions

1. Update campaign actions display:
```tsx
function CampaignActions({ actions, costPerAction }) {
  const { selectedActions } = useDashboardActions();
  
  const filteredActions = actions.filter(
    action => selectedActions.includes(action.action_type)
  );

  return (
    <div>
      {filteredActions.map(action => (
        // Render action metrics
      ))}
    </div>
  );
}
```

## Step 4: Update DashboardMetrics

1. Filter metrics based on selection:
```tsx
function DashboardMetrics() {
  const { selectedActions } = useDashboardActions();
  
  const filteredMetrics = useMemo(() => 
    metrics.filter(metric => selectedActions.includes(metric.type))
  , [metrics, selectedActions]);

  return (
    <div>
      {filteredMetrics.map(metric => (
        // Render metric
      ))}
    </div>
  );
}
```

## Step 5: Add Loading States

1. Update components to handle loading:
```tsx
function DashboardCampaigns() {
  const { isLoading } = useDashboardActions();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Rest of component
}
```

## Step 6: Error Handling

1. Add error boundaries:
```tsx
function DashboardErrorBoundary() {
  return (
    <ErrorBoundary fallback={<ErrorState />}>
      <DashboardCampaigns />
    </ErrorBoundary>
  );
}
```

## Step 7: Testing

1. Add integration tests:
```typescript
describe('Dashboard Integration', () => {
  it('should filter actions based on selection');
  it('should persist selection between reloads');
  it('should handle errors gracefully');
});
```

## Step 8: Performance Optimization

1. Add Memoization:
```tsx
const filteredActions = useMemo(() => 
  actions.filter(action => selectedActions.has(action.id))
, [actions, selectedActions]);
```

2. Add Suspense boundaries:
```tsx
<Suspense fallback={<LoadingSpinner />}>
  <DashboardMetrics />
</Suspense>
```

## Step 9: Documentation

1. Update docs with new feature:
```markdown
### Action Selection
Users can now select which metrics to display in the dashboard:
1. Click "Select Metrics" in the dashboard header
2. Choose desired metrics by category
3. Apply changes to update the view
```

## Step 10: Migration

1. Phase out old metrics display:
- Mark as deprecated
- Add migration guide
- Remove in next major version

## Implementation Order

1. Core Integration (Days 1-2)
   - [ ] Context implementation
   - [ ] Basic UI integration
   - [ ] State persistence

2. Feature Implementation (Days 3-4)
   - [ ] Filtering logic
   - [ ] Loading states
   - [ ] Error handling

3. Polish & Testing (Day 5)
   - [ ] Performance optimization
   - [ ] Testing
   - [ ] Documentation

## Validation Checklist

- [ ] Actions filter correctly
- [ ] Selection persists on reload
- [ ] Loading states work
- [ ] Errors handled properly
- [ ] Performance metrics met
- [ ] Tests passing
- [ ] Documentation updated

## Rollout Strategy

1. Development
   - Implement core features
   - Add tests
   - Review performance

2. Testing
   - Internal testing
   - User acceptance
   - Performance monitoring

3. Production
   - Gradual rollout
   - Monitor metrics
   - Gather feedback