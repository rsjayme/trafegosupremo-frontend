"use client";

import * as React from "react";
import { Chip } from "@/components/ui/chip";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface ActionChipProps {
    id: string;
    label: string;
    selected: boolean;
    category: string;
    description?: string;
    onToggle: (id: string) => void;
    disabled?: boolean;
}

export const ActionChip = React.forwardRef<HTMLDivElement, ActionChipProps>(
    ({ id, label, selected, category, description, onToggle, disabled }, ref) => {
        const handleKeyDown = (event: React.KeyboardEvent) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onToggle(id);
            }
        };

        const getCategoryColor = (category: string): string => {
            switch (category.toLowerCase()) {
                case "messaging":
                    return "text-purple-500";
                case "engagement":
                    return "text-blue-500";
                case "interaction":
                    return "text-orange-500";
                default:
                    return "text-gray-500";
            }
        };

        const categoryColor = getCategoryColor(category);

        return (
            <Chip
                ref={ref}
                role="switch"
                aria-checked={selected}
                selected={selected}
                variant={selected ? "selected" : "default"}
                animation="bounce"
                disabled={disabled}
                className={cn(
                    "group relative",
                    selected && "ring-2 ring-offset-2 ring-primary",
                    disabled && "cursor-not-allowed opacity-50"
                )}
                onClick={() => !disabled && onToggle(id)}
                onKeyDown={handleKeyDown}
            >
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <span
                            className={cn(
                                "absolute -left-1 -top-1 flex h-3 w-3 items-center justify-center",
                                selected ? "opacity-100" : "opacity-0",
                                "transition-opacity duration-200"
                            )}
                        >
                            <Check className="h-2.5 w-2.5 text-primary" />
                        </span>
                        <div className={cn(
                            "h-2 w-2 rounded-full",
                            categoryColor,
                            "opacity-40 group-hover:opacity-60 transition-opacity"
                        )} />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                </div>
                {description && (
                    <span className="sr-only">
                        {description}
                    </span>
                )}
            </Chip>
        );
    }
);

ActionChip.displayName = "ActionChip";