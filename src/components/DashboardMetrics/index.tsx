"use client";

import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Target, Eye, MousePointer, RefreshCcw, AlertCircle } from "lucide-react";
import { useFacebookData } from "@/hooks/useFacebookData";
import { subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MetricCardProps {
    title: string;
    value: string;
    comparison?: number;
    icon: React.ReactNode;
    isLoading?: boolean;
}

function MetricCard({ title, value, comparison, icon, isLoading }: MetricCardProps) {
    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <RefreshCcw className="h-5 w-5 text-primary animate-spin" />
                    </div>
                    <div className="space-y-2 w-full">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <div className="h-7 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4" />
                    </div>
                </div>
            </Card>
        );
    }

    const isPositive = comparison && comparison > 0;

    return (
        <Card className="p-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                    {comparison !== undefined && (
                        <p className={`text-sm flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"
                            }`}>
                            {isPositive ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                            {Math.abs(comparison)}% em relação ao período anterior
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}

interface DashboardMetricsProps {
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    accountId: string;
}

export function DashboardMetrics({ dateRange, accountId }: DashboardMetricsProps) {
    // Calcula o período anterior para comparação
    const previousDateRange = dateRange.from && dateRange.to ? {
        from: subDays(dateRange.from, dateRange.to.getTime() - dateRange.from.getTime()),
        to: subDays(dateRange.to, dateRange.to.getTime() - dateRange.from.getTime())
    } : undefined;

    const currentRange = dateRange.from && dateRange.to ? {
        since: dateRange.from.toISOString().split('T')[0],
        until: dateRange.to.toISOString().split('T')[0]
    } : undefined;

    const previousRange = previousDateRange?.from && previousDateRange?.to ? {
        since: previousDateRange.from.toISOString().split('T')[0],
        until: previousDateRange.to.toISOString().split('T')[0]
    } : undefined;

    const {
        totals: currentTotals,
        isLoading,
        error,
        refreshData
    } = useFacebookData({
        autoLoad: true,
        accountId,
        dateRange: currentRange
    });

    const { totals: previousTotals } = useFacebookData({
        autoLoad: true,
        accountId,
        dateRange: previousRange
    });

    const handleRefresh = async () => {
        try {
            await refreshData();
            toast.success('Métricas atualizadas com sucesso!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar métricas');
        }
    };

    const calculateComparison = (current?: number, previous?: number) => {
        if (!current || !previous) return undefined;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const formatCurrency = (value?: number) => {
        if (!value) return "R$ 0,00";
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const formatNumber = (value?: number) => {
        if (!value) return "0";
        return value.toLocaleString('pt-BR');
    };

    if (error) {
        return (
            <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-lg font-semibold">Erro ao carregar métricas</h3>
                <p className="text-sm text-gray-500">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Tentar novamente
                </Button>
            </Card>
        );
    }

    const metrics = [
        {
            title: "Gasto Total",
            value: formatCurrency(currentTotals?.spend),
            comparison: calculateComparison(currentTotals?.spend, previousTotals?.spend),
            icon: <DollarSign className="h-5 w-5 text-primary" />,
        },
        {
            title: "Alcance",
            value: formatNumber(currentTotals?.reach),
            comparison: calculateComparison(currentTotals?.reach, previousTotals?.reach),
            icon: <Target className="h-5 w-5 text-primary" />,
        },
        {
            title: "Impressões",
            value: formatNumber(currentTotals?.impressions),
            comparison: calculateComparison(currentTotals?.impressions, previousTotals?.impressions),
            icon: <Eye className="h-5 w-5 text-primary" />,
        },
        {
            title: "Cliques",
            value: formatNumber(currentTotals?.clicks),
            comparison: calculateComparison(currentTotals?.clicks, previousTotals?.clicks),
            icon: <MousePointer className="h-5 w-5 text-primary" />,
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    disabled={isLoading}
                >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Atualizando...' : 'Atualizar'}
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => (
                    <MetricCard
                        key={metric.title}
                        {...metric}
                        isLoading={isLoading}
                    />
                ))}
            </div>
        </div>
    );
}