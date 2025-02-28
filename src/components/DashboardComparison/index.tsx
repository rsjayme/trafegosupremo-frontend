"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import type { ComparisonResult } from "@/hooks/useDashboardComparison";

interface Props {
    title: string;
    value: string;
    comparison: ComparisonResult;
}

function ComparisonIndicator({ comparison }: { comparison: ComparisonResult }) {
    const color = comparison.trend === 'up' ? 'text-green-500' :
        comparison.trend === 'down' ? 'text-red-500' :
            'text-gray-500';

    return (
        <div className={`flex items-center gap-1 ${color}`}>
            {comparison.trend === 'up' ? (
                <ArrowUpIcon className="w-4 h-4" />
            ) : comparison.trend === 'down' ? (
                <ArrowDownIcon className="w-4 h-4" />
            ) : (
                <MinusIcon className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
                {Math.abs(comparison.percentage).toFixed(1)}%
            </span>
        </div>
    );
}

export function DashboardComparisonCard({ title, value, comparison }: Props) {
    return (
        <Card className="p-4">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h3>
                <ComparisonIndicator comparison={comparison} />
            </div>
            <p className="text-2xl font-semibold">
                {value}
            </p>
        </Card>
    );
}

interface MetricsProps {
    metrics: {
        spend: string;
        actions: string;
        cpa: string;
        ctr: string;
    };
    comparisons: {
        spend: ComparisonResult;
        actions: ComparisonResult;
        cpa: ComparisonResult;
        ctr: ComparisonResult;
    };
}

export function DashboardComparison({ metrics, comparisons }: MetricsProps) {
    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-6">
            <DashboardComparisonCard
                title="Gasto Total"
                value={metrics.spend}
                comparison={comparisons.spend}
            />
            <DashboardComparisonCard
                title="Total de Resultados"
                value={metrics.actions}
                comparison={comparisons.actions}
            />
            <DashboardComparisonCard
                title="CPA Médio"
                value={metrics.cpa}
                comparison={comparisons.cpa}
            />
            <DashboardComparisonCard
                title="CTR Médio"
                value={metrics.ctr}
                comparison={comparisons.ctr}
            />
        </div>
    );
}