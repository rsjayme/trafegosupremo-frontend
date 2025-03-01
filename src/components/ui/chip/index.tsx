"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const chipVariants = cva(
    "inline-flex items-center justify-center rounded-full transition-all select-none",
    {
        variants: {
            variant: {
                default: "bg-muted hover:bg-muted/80",
                primary: "bg-primary text-primary-foreground hover:bg-primary/90",
                selected: "bg-primary/10 text-primary border-2 border-primary",
                outline: "border border-input hover:bg-accent hover:text-accent-foreground",
            },
            size: {
                sm: "h-7 px-3 text-xs",
                md: "h-8 px-4 text-sm",
                lg: "h-9 px-5 text-base",
            },
            animation: {
                none: "",
                bounce: "active:scale-95 hover:scale-105",
                smooth: "transition-all duration-200",
            },
            disabled: {
                true: "opacity-50 pointer-events-none",
                false: "cursor-pointer",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "md",
            animation: "smooth",
            disabled: false,
        },
    }
);

export interface ChipProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
    selected?: boolean;
    icon?: React.ReactNode;
    onRemove?: () => void;
    disabled?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
    (
        {
            className,
            variant,
            size,
            animation,
            selected,
            icon,
            children,
            onRemove,
            disabled,
            ...props
        },
        ref
    ) => {
        // Determine the effective variant based on selection state
        const effectiveVariant = selected ? "selected" : variant;

        return (
            <div
                ref={ref}
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                className={cn(
                    chipVariants({
                        variant: effectiveVariant,
                        size,
                        animation,
                        disabled,
                    }),
                    className
                )}
                {...props}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {children}
                {onRemove && !disabled && (
                    <button
                        type="button"
                        className="ml-2 rounded-full hover:bg-muted/20 p-0.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        aria-label="Remove"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
            </div>
        );
    }
);

Chip.displayName = "Chip";

export { Chip, chipVariants };