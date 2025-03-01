# Action Selector Component Architecture

## Component Structure

```
components/ActionSelector/
├── index.tsx                  # Main entry point
├── ActionChip.tsx            # Individual metric selection chip
├── CategoryGroup.tsx         # Group of related metrics
├── SearchBar.tsx            # Metric search component
└── types/
    └── index.ts             # Type definitions

components/ui/
├── chip/
│   ├── index.tsx           # Base chip component
│   └── variants.ts         # Chip style variants
└── dialog/
    └── index.tsx           # Dialog component
```

## Core Components

### 1. ActionChip
```typescript
interface ActionChipProps {
  action: {
    id: string;
    label: string;
    category: string;
  };
  isSelected: boolean;
  onToggle: (id: string) => void;
  // New modern UI props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'solid';
  animation?: 'bounce' | 'pulse' | 'none';
}
```

### 2. CategoryGroup
```typescript
interface CategoryGroupProps {
  category: {
    id: string;
    label: string;
    actions: ActionChipProps['action'][];
  };
  selectedActions: Set<string>;
  onSelectionChange: (actionIds: string[]) => void;
  // Quick selection options
  onSelectAll: () => void;
  onSelectNone: () => void;
  onSelectEssential: () => void;
}
```

### 3. SearchBar
```typescript
interface SearchBarProps {
  onSearch: (term: string) => void;
  suggestions?: string[];
  recentSearches?: string[];
  // Advanced features
  filterByCategory?: boolean;
  highlightMatches?: boolean;
}
```

## Animations

### 1. Selection Animation
```typescript
const chipAnimationVariants = {
  unselected: {
    scale: 1,
    opacity: 0.9,
    backgroundColor: 'var(--background)'
  },
  selected: {
    scale: [1, 1.05, 1],
    opacity: 1,
    backgroundColor: 'var(--primary)'
  }
};
```

### 2. Search Highlighting
```typescript
interface HighlightTextProps {
  text: string;
  highlight: string;
  className?: string;
}
```

## Modern UI Elements

### 1. Chip Component
```typescript
interface ChipProps {
  selected?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  // Visual variants
  variant?: 'solid' | 'soft' | 'outline';
  color?: 'default' | 'primary' | 'success' | 'warning';
  // Interaction states
  interactive?: boolean;
  removable?: boolean;
  // Animations
  animate?: boolean;
  transition?: {
    duration?: number;
    ease?: string;
  };
}
```

### 2. Category Header
```typescript
interface CategoryHeaderProps {
  title: string;
  description?: string;
  count: number;
  selectedCount: number;
  // Quick actions
  actions?: {
    label: string;
    onClick: () => void;
  }[];
  // Visual style
  variant?: 'default' | 'compact' | 'expanded';
  showProgress?: boolean;
}
```

## State Management

### 1. Selection Store
```typescript
interface SelectionState {
  selected: Set<string>;
  categories: {
    [key: string]: {
      expanded: boolean;
      allSelected: boolean;
    };
  };
  search: {
    term: string;
    results: string[];
  };
}
```

### 2. Persistence Layer
```typescript
interface StorageSchema {
  version: number;
  selections: {
    actions: string[];
    categories: {
      [key: string]: {
        expanded: boolean;
        preference: 'all' | 'none' | 'custom';
      };
    };
  };
  preferences: {
    defaultView: 'expanded' | 'compact';
    showDescriptions: boolean;
    searchHistory: string[];
  };
}
```

## Event Handling

### 1. Drag Selection
```typescript
interface DragSelectionState {
  active: boolean;
  startIndex: number;
  currentIndex: number;
  selection: Set<string>;
}
```

### 2. Keyboard Navigation
```typescript
const useKeyboardNavigation = (props: {
  items: string[];
  onSelect: (id: string) => void;
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
}) => {
  // Implementation
};
```

## Styling System

### 1. Base Theme
```typescript
interface ChipTheme {
  borderRadius: string;
  fontSize: Record<'sm' | 'md' | 'lg', string>;
  padding: Record<'sm' | 'md' | 'lg', string>;
  colors: {
    background: Record<'default' | 'selected' | 'hover', string>;
    text: Record<'default' | 'selected' | 'disabled', string>;
    border: Record<'default' | 'selected' | 'focus', string>;
  };
}
```

### 2. Animation Tokens
```typescript
const transitions = {
  quick: '100ms ease',
  normal: '200ms ease-in-out',
  smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};
```

## Accessibility Features

### 1. ARIA Support
```typescript
interface AccessibleChipProps extends ChipProps {
  'aria-label'?: string;
  'aria-selected'?: boolean;
  'aria-describedby'?: string;
  role?: 'option' | 'switch' | 'checkbox';
}
```

### 2. Keyboard Support
```typescript
const keyboardShortcuts = {
  toggleSelection: ['Space', 'Enter'],
  navigation: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  categoryExpand: ['Alt+ArrowDown', 'Alt+ArrowUp'],
  search: ['Control+F', '/'],
  confirm: ['Control+Enter'],
  cancel: ['Escape']
};