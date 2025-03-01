# Action Selector Component

A modern, accessible component for selecting and managing Facebook action metrics with intuitive chip-based interactions.

## Usage

```tsx
import { ActionSelector } from "@/components/ActionSelector";

function DashboardMetrics() {
  const [selectedActions, setSelectedActions] = React.useState<string[]>([]);

  return (
    <ActionSelector
      actions={[
        {
          id: "post_engagement",
          label: "Post Engagement",
          category: "engagement",
          description: "Total post engagements"
        },
        // ... more actions
      ]}
      categories={[
        {
          id: "engagement",
          label: "Engagement Metrics"
        },
        // ... more categories
      ]}
      selectedActions={selectedActions}
      onSelectionChange={setSelectedActions}
    />
  );
}
```

## Components

### 1. ActionSelector
Main component that provides the selection interface.

```tsx
interface ActionSelectorProps {
  actions: Action[];
  selectedActions: string[];
  onSelectionChange: (actions: string[]) => void;
  categories: Category[];
}
```

### 2. ActionChip
Individual selectable metric chip.

```tsx
interface ActionChipProps {
  id: string;
  label: string;
  selected: boolean;
  category: string;
  description?: string;
  onToggle: (id: string) => void;
  disabled?: boolean;
}
```

### 3. CategoryGroup
Groups related actions and provides bulk selection.

```tsx
interface CategoryGroupProps {
  category: {
    id: string;
    label: string;
    description?: string;
  };
  actions: Action[];
  selectedActions: Set<string>;
  onSelectionChange: (actionIds: string[]) => void;
  isExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}
```

## Features

- Modern chip-based selection
- Category grouping
- Search and filtering
- Bulk selection controls
- Persistent preferences
- Keyboard navigation
- Touch-friendly
- Accessible
- Responsive design

## Keyboard Support

- `Space/Enter`: Toggle selection
- `Arrow Keys`: Navigate between items
- `Tab`: Navigate through interactive elements
- `Escape`: Close dialog
- `Ctrl+Enter`: Apply changes

## Styling

The component uses Tailwind CSS and follows your application's theme. Customize the appearance by modifying:

1. Base Theme:
```tsx
const chipVariants = cva(
  "inline-flex items-center justify-center rounded-full transition-all select-none",
  {
    variants: {
      variant: {
        default: "bg-muted hover:bg-muted/80",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        selected: "bg-primary/10 text-primary border-2 border-primary",
        // ... more variants
      }
    }
  }
);
```

2. Category Colors:
```tsx
const categoryColors = {
  messaging: "purple",
  engagement: "blue",
  interaction: "orange"
};
```

## Storage

The component persists selections and preferences in localStorage:

```typescript
interface StoredState {
  selectedActions: string[];
  expandedCategories: string[];
}
```

Access with:
```typescript
const STORAGE_KEY = "action-selector-state";
```

## Accessibility

- ARIA roles and attributes
- Focus management
- Screen reader announcements
- Keyboard navigation
- High contrast support

## Performance

- Memoized computations
- Lazy loading
- Debounced search
- Optimized renders

## Error Handling

The component handles:
- Invalid selections
- Storage errors
- Loading failures
- Validation errors

## Examples

### Basic Usage
```tsx
<ActionSelector
  actions={actions}
  selectedActions={selectedActions}
  onSelectionChange={setSelectedActions}
  categories={categories}
/>
```

### With Default Selection
```tsx
const defaultActions = ["post_engagement", "link_click"];

<ActionSelector
  actions={actions}
  selectedActions={defaultActions}
  onSelectionChange={setSelectedActions}
  categories={categories}
/>
```

### With Search Suggestions
```tsx
<ActionSelector
  actions={actions}
  selectedActions={selectedActions}
  onSelectionChange={setSelectedActions}
  categories={categories}
  searchSuggestions={["Engagement", "Clicks", "Views"]}
/>
```

## Best Practices

1. Provide meaningful descriptions
2. Group related actions
3. Set sensible defaults
4. Handle loading states
5. Manage errors gracefully
6. Monitor performance
7. Test accessibility