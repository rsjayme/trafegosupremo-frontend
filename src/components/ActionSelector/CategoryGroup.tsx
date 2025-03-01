"use client";

import * as React from "react";
import { ActionChip } from "./ActionChip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CategoryGroupProps } from "./types";

export function CategoryGroup({
    category,
    actions,
    selectedActions,
    onSelectionChange,
    isExpanded = true,
    onExpandedChange
}: CategoryGroupProps) {
    const [localExpanded, setLocalExpanded] = React.useState(isExpanded);

    // Sync with external expanded state
    React.useEffect(() => {
        setLocalExpanded(isExpanded);
    }, [isExpanded]);

    const handleExpandToggle = () => {
        const newExpanded = !localExpanded;
        setLocalExpanded(newExpanded);
        onExpandedChange?.(newExpanded);
    };

    const selectedInCategory = actions.filter(action =>
        selectedActions.has(action.id)
    ).length;

    const isAllSelected = selectedInCategory === actions.length;
    const isPartiallySelected = selectedInCategory > 0 && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            // Deselect all in category
            onSelectionChange([...selectedActions].filter(id =>
                !actions.some(action => action.id === id)
            ));
        } else {
            // Select all in category
            onSelectionChange([
                ...selectedActions,
                ...actions.map(action => action.id)
            ]);
        }
    };

    const getCategoryColor = (categoryId: string): "default" | "blue" | "purple" | "orange" => {
        switch (categoryId.toLowerCase()) {
            case "messaging":
                return "purple";
            case "engagement":
                return "blue";
            case "interaction":
                return "orange";
            default:
                return "default";
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExpandToggle}
                        className="p-1 hover:bg-muted rounded-md transition-colors"
                        aria-label={localExpanded ? "Collapse category" : "Expand category"}
                    >
                        <ChevronRight
                            className={cn(
                                "h-4 w-4 transition-transform duration-200",
                                localExpanded && "rotate-90"
                            )}
                        />
                    </button>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium">{category.label}</h3>
                        <Badge variant={getCategoryColor(category.id)}>
                            {selectedInCategory} / {actions.length}
                        </Badge>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs"
                    >
                        {isAllSelected
                            ? "Deselect All"
                            : isPartiallySelected
                                ? "Select All"
                                : "Select All"}
                    </Button>
                </div>
            </div>

            <div className={cn(
                "grid transition-all duration-200 overflow-hidden",
                localExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}>
                <div className="min-h-0">
                    <div className={cn(
                        "grid gap-2 p-2",
                        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    )}>
                        {actions.map((action) => (
                            <ActionChip
                                key={action.id}
                                id={action.id}
                                label={action.label}
                                category={category.id}
                                description={action.description}
                                selected={selectedActions.has(action.id)}
                                onToggle={(id) => {
                                    // Convert single action toggle to array format
                                    const currentSelection = [...selectedActions];
                                    const index = currentSelection.indexOf(id);

                                    if (index === -1) {
                                        onSelectionChange([...currentSelection, id]);
                                    } else {
                                        currentSelection.splice(index, 1);
                                        onSelectionChange(currentSelection);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}