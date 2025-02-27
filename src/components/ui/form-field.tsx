"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ComponentPropsWithoutRef } from "react";

interface FormFieldProps extends ComponentPropsWithoutRef<"input"> {
    label: string;
    error?: string;
}

export function FormField({ label, error, className, ...props }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </label>
            <Input
                className={cn(
                    error && "border-red-500 focus-visible:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-sm font-medium text-red-500">{error}</p>
            )}
        </div>
    );
}