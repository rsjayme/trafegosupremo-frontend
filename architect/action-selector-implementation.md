# Facebook Actions Selector Implementation

## Overview
Implement a feature to allow users to select which Facebook action metrics they want to display in the dashboard.

## Components Structure

### 1. ActionSelector Component
- Uses Radix UI Popover for the selection interface
- ScrollArea for handling many options
- Checkbox list for multiple selection
- Persists selections in localStorage
- Groups actions by category (Messaging, Engagement, Media)

### 2. Selected Actions Context
```typescript
interface ActionSelectorContext {
  selectedActions: string[];
  setSelectedActions: (actions: string[]) => void;
  defaultActions: string[];
}
```

### 3. Storage Implementation
```typescript
const STORAGE_KEY = 'dashboard-selected-actions';
// Save to localStorage
const saveSelectedActions = (actions: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
};
// Load from localStorage
const loadSelectedActions = (): string[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
};
```

## Action Categories
```typescript
const ACTION_CATEGORIES = {
  messaging: {
    label: "Messaging",
    actions: [
      "onsite_conversion.messaging_first_reply",
      "onsite_conversion.messaging_conversation_started_7d",
      "onsite_conversion.messaging_block",
      "onsite_conversion.messaging_user_depth_2_message_send",
      "onsite_conversion.messaging_user_depth_3_message_send",
      "onsite_conversion.messaging_welcome_message_view"
    ]
  },
  engagement: {
    label: "Engagement",
    actions: [
      "post_engagement",
      "page_engagement",
      "post_reaction",
      "comment",
      "post",
      "onsite_conversion.post_save"
    ]
  },
  interaction: {
    label: "Interaction",
    actions: [
      "link_click",
      "video_view",
      "onsite_conversion.total_messaging_connection"
    ]
  }
};
```

## UI Components Needed
1. `Popover` (from @radix-ui/react-popover)
   - Trigger button with settings icon
   - Content panel with scrollable area

2. `ScrollArea` (from @radix-ui/react-scroll-area)
   - For long lists of actions

3. Custom Checkbox Component
   - For selecting individual actions
   - Show action name and category

## Implementation Steps

1. Create ActionSelectorContext
```typescript
export const ActionSelectorContext = createContext<ActionSelectorContext>({
  selectedActions: [],
  setSelectedActions: () => {},
  defaultActions: []
});
```

2. Implement ActionSelector Component
- Trigger button in dashboard header
- Popover with categorized action list
- Save/cancel buttons
- "Select All" per category
- Loading/saving indicators

3. Modify DashboardCampaigns Component
- Filter actions based on selection
- Update actions display logic
- Handle empty selection state

4. Add Persistence Layer
- Save to localStorage
- Load on component mount
- Handle migration of old settings

## User Experience Considerations
1. Show action descriptions on hover
2. Group actions by category
3. Allow bulk selection per category
4. Provide quick "Reset to Default" option
5. Show selected count in trigger button

## Future Enhancements
1. Custom action ordering
2. Favorite actions
3. Search/filter actions
4. Export/import settings
5. Per-user preferences (if backend storage added)