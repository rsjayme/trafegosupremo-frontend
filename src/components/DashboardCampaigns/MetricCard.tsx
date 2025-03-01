import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
    label: string;
    value: string;
    subtitle?: string;
    className?: string;
}

export function MetricCard({
    label,
    value,
    subtitle,
    className
}: MetricCardProps) {
    return (
        <Card
            className={cn(
                "p-4 space-y-2 transition-colors hover:bg-muted/50",
                className
            )}
        >
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-pretty">{label}</p>
                <p className="text-lg font-semibold">{value}</p>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
            </div>
        </Card>
    );
}