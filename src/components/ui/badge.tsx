import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-primary/10 text-primary",
                success: "bg-green-100 text-green-700",
                warning: "bg-yellow-100 text-yellow-700",
                danger: "bg-red-100 text-red-700",
                purple: "bg-purple-100 text-purple-700",
                blue: "bg-blue-100 text-blue-700",
                orange: "bg-orange-100 text-orange-700",
            },
            bordered: {
                true: "border border-current",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, bordered, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, bordered }), className)} {...props} />
    );
}

export { Badge, badgeVariants };