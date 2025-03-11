import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    ACTION_DEFINITIONS,
    DEFAULT_ACTIONS,
    CATEGORIES
} from './constants';

interface StoredState {
    selectedActions: string[];
    expandedCategories: string[];
    lastUpdated: string;
}

const STORAGE_KEY = 'action-selector-state';

interface UseActionSelectionProps {
    initialSelection?: string[];
    onSelectionChange?: (selection: string[]) => void;
}

interface UseActionSelectionReturn {
    selectedActions: Set<string>;
    expandedCategories: Set<string>;
    filteredActions: typeof ACTION_DEFINITIONS;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    toggleAction: (actionId: string) => void;
    toggleCategory: (categoryId: string, selected: boolean) => void;
    toggleExpanded: (categoryId: string) => void;
    resetSelection: () => void;
    saveSelection: () => void;
    getActionsByCategory: (categoryId: string) => typeof ACTION_DEFINITIONS;
    getSelectionStats: () => {
        total: number;
        selected: number;
        byCategory: Record<string, { total: number; selected: number }>;
    };
}

export function useActionSelection({
    initialSelection = DEFAULT_ACTIONS,
    onSelectionChange
}: UseActionSelectionProps = {}): UseActionSelectionReturn {
    // State
    const [selectedActions, setSelectedActions] = useState<Set<string>>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const { selectedActions } = JSON.parse(stored) as StoredState;
                return new Set(selectedActions);
            }
        } catch (error) {
            console.error('Failed to load stored selection:', error);
        }
        return new Set(initialSelection);
    });

    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const { expandedCategories } = JSON.parse(stored) as StoredState;
                return new Set(expandedCategories);
            }
        } catch (error) {
            console.error('Failed to load expanded categories:', error);
        }
        return new Set(Object.values(CATEGORIES));
    });

    const [searchTerm, setSearchTerm] = useState('');

    // Callbacks
    const toggleAction = useCallback((actionId: string) => {
        setSelectedActions(current => {
            const updated = new Set(current);
            if (updated.has(actionId)) {
                updated.delete(actionId);
            } else {
                updated.add(actionId);
            }
            return updated;
        });
    }, []);

    const toggleCategory = useCallback((categoryId: string, selected: boolean) => {
        const categoryActions = ACTION_DEFINITIONS.filter(
            action => action.category === categoryId
        );

        setSelectedActions(current => {
            const updated = new Set(current);
            categoryActions.forEach(action => {
                if (selected) {
                    updated.add(action.id);
                } else {
                    updated.delete(action.id);
                }
            });
            return updated;
        });
    }, []);

    const toggleExpanded = useCallback((categoryId: string) => {
        setExpandedCategories(current => {
            const updated = new Set(current);
            if (updated.has(categoryId)) {
                updated.delete(categoryId);
            } else {
                updated.add(categoryId);
            }
            return updated;
        });
    }, []);

    const resetSelection = useCallback(() => {
        setSelectedActions(new Set(initialSelection));
    }, [initialSelection]);

    const saveSelection = useCallback(() => {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({
                    selectedActions: Array.from(selectedActions),
                    expandedCategories: Array.from(expandedCategories),
                    lastUpdated: new Date().toISOString()
                })
            );
        } catch (error) {
            console.error('Failed to save selection:', error);
        }
    }, [selectedActions, expandedCategories]);

    // Effects
    useEffect(() => {
        onSelectionChange?.(Array.from(selectedActions));
    }, [selectedActions, onSelectionChange]);

    // Memoized values
    const filteredActions = useMemo(() => {
        if (!searchTerm) return ACTION_DEFINITIONS;

        const term = searchTerm.toLowerCase();
        return ACTION_DEFINITIONS.filter(
            action =>
                action.label.toLowerCase().includes(term) ||
                action.description?.toLowerCase().includes(term)
        );
    }, [searchTerm]);

    const getActionsByCategory = useCallback((categoryId: string) => {
        return filteredActions.filter(action => action.category === categoryId);
    }, [filteredActions]);

    const getSelectionStats = useCallback(() => {
        const stats = {
            total: ACTION_DEFINITIONS.length,
            selected: selectedActions.size,
            byCategory: Object.values(CATEGORIES).reduce((acc, categoryId) => {
                const categoryActions = ACTION_DEFINITIONS.filter(
                    action => action.category === categoryId
                );
                const selectedInCategory = categoryActions.filter(action =>
                    selectedActions.has(action.id)
                );

                acc[categoryId] = {
                    total: categoryActions.length,
                    selected: selectedInCategory.length
                };
                return acc;
            }, {} as Record<string, { total: number; selected: number }>)
        };
        return stats;
    }, [selectedActions]);

    return {
        selectedActions,
        expandedCategories,
        filteredActions,
        searchTerm,
        setSearchTerm,
        toggleAction,
        toggleCategory,
        toggleExpanded,
        resetSelection,
        saveSelection,
        getActionsByCategory,
        getSelectionStats
    };
}