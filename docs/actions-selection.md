# Facebook Actions Selection Feature

## Overview
The actions selection feature allows users to choose which Facebook metrics they want to display in their campaign dashboard. Selected actions persist between sessions and can be easily modified through a modern, intuitive interface.

## Usage

### Basic Usage
1. Navigate to the Campaigns dashboard
2. Click "Select Metrics" in the dashboard header
3. Choose desired metrics from the categories:
   - Messaging
   - Engagement
   - Interaction
4. Click "Apply Changes" to update the view

### Default Metrics
By default, the following metrics are selected:
- Post Engagement
- Page Engagement
- Link Clicks
- Video Views
- First Response

### Persistence
- Selected actions are saved in browser storage
- Settings persist between page reloads
- Each user can have their own preferences

## Interface

### Action Selection Dialog
```
┌─ Select Metrics ────────────────────┐
│                                     │
│  [Search metrics...]                │
│                                     │
│  Messaging                          │
│  ├─ First Response                  │
│  ├─ Started Conversations          │
│  └─ Message Blocks                  │
│                                     │
│  Engagement                         │
│  ├─ Post Engagement                │
│  ├─ Page Engagement                │
│  └─ Reactions                      │
│                                     │
│  [Cancel]           [Apply Changes] │
└─────────────────────────────────────┘
```

### Metrics Display
- Selected metrics appear as cards under each campaign
- Each metric shows:
  - Action name
  - Value
  - Cost per action (when available)

## Features

### Search & Filter
- Search metrics by name
- Filter by category
- Quick selection options per category

### Bulk Actions
- Select/deselect all in category
- Reset to default selection
- Clear all selections

### Visual Feedback
- Selected state indication
- Category completion status
- Real-time updates

## Technical Details

### Storage
```typescript
// Local Storage Key
const STORAGE_KEY = 'dashboard-selected-actions';

// Storage Format
interface StoredState {
  selectedActions: string[];
}
```

### Action Types
All available Facebook action types are supported, including:
- Post engagement
- Page engagement
- Messaging actions
- Link clicks
- Video views
- And more...

### Performance
- Optimized for large datasets
- Smooth animations
- Responsive interface

## Best Practices

1. Metric Selection
   - Choose relevant metrics for your analysis
   - Don't select too many metrics at once
   - Group similar metrics together

2. Organization
   - Use categories to find metrics quickly
   - Leverage search for specific metrics
   - Save commonly used combinations

3. Performance
   - Clear unused selections
   - Use search for large lists
   - Let interface load completely

## Example Code

```tsx
// Using the ActionSelector component
<ActionSelector
  selectedActions={selectedActions}
  onSelectionChange={setSelectedActions}
/>

// Handling selection changes
function handleSelectionChange(newSelection: string[]) {
  setSelectedActions(newSelection);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newSelection));
}
```

## Troubleshooting

1. Selections Not Saving
   - Check browser storage permissions
   - Clear browser cache
   - Verify localStorage availability

2. Metrics Not Displaying
   - Verify data availability
   - Check selection state
   - Confirm API responses

3. Performance Issues
   - Reduce number of selected metrics
   - Clear browser cache
   - Check network connectivity