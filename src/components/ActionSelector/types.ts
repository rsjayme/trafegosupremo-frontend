export interface Action {
    id: string;
    label: string;
    category: string;
    description?: string;
}

export interface Category {
    id: string;
    label: string;
    description?: string;
}

export interface ActionSelectorProps {
    actions: Action[];
    selectedActions: string[];
    onSelectionChange: (actions: string[]) => void;
    categories: Category[];
}

export interface StoredState {
    selectedActions: string[];
    expandedCategories: string[];
    lastUpdated: string;
}

export interface UseActionSelectionProps {
    initialSelection?: string[];
    onSelectionChange?: (selection: string[]) => void;
}

export interface UseActionSelectionReturn {
    selectedActions: Set<string>;
    expandedCategories: Set<string>;
    filteredActions: Action[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    toggleAction: (actionId: string) => void;
    toggleCategory: (categoryId: string, selected: boolean) => void;
    toggleExpanded: (categoryId: string) => void;
    resetSelection: () => void;
    saveSelection: () => void;
    getActionsByCategory: (categoryId: string) => Action[];
    getSelectionStats: () => {
        total: number;
        selected: number;
        byCategory: Record<string, { total: number; selected: number }>;
    };
}

export interface ActionChipProps {
    id: string;
    label: string;
    selected: boolean;
    category: string;
    description?: string;
    onToggle: (id: string) => void;
    disabled?: boolean;
}

export interface CategoryGroupProps {
    category: Category;
    actions: Action[];
    selectedActions: Set<string>;
    onSelectionChange: (actionIds: string[]) => void;
    isExpanded?: boolean;
    onExpandedChange?: (expanded: boolean) => void;
}

export interface SearchBarProps {
    onSearch: (term: string) => void;
    totalActions: number;
    matchCount: number;
    suggestions?: string[];
    className?: string;
}

export interface SearchHighlightProps {
    text: string;
    highlight: string;
    className?: string;
}