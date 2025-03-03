"use client";

import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp, DollarSign, Target, Eye, MousePointer, RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardService } from "@/services/dashboard";
import { type FacebookCampaignMetrics } from "@/types/dashboard";
import { useAccount } from "@/contexts/AccountContext";

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
            <Card className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5">
                    {icon}
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <RefreshCcw className="h-5 w-5 text-primary animate-spin" />
                    </div>
                    <div className="space-y-2 w-full">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">{title}</p>
                            <div className="h-5 bg-gray-100 animate-pulse rounded-full w-16" />
                        </div>
                        <div className="h-8 bg-gray-200 animate-pulse rounded" />
                        <div className="h-4 bg-gray-100 animate-pulse rounded w-24" />
                    </div>
                </div>
            </Card>
        );
    }

    const isPositive = comparison && comparison > 0;

    return (
        <Card className="p-6 hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-5">
                {icon}
            </div>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">{title}</p>
                        {comparison !== undefined && (
                            <span
                                className={`px-2 py-0.5 text-xs rounded-full ${isPositive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                            >
                                <span className="flex items-center gap-0.5">
                                    {isPositive ? (
                                        <ArrowUp className="h-3 w-3" />
                                    ) : (
                                        <ArrowDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(comparison)}%
                                </span>
                            </span>
                        )}
                    </div>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {comparison !== undefined && (
                        <p className="text-xs text-muted-foreground mt-1">
                            vs período anterior
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
    brandId: number;
}
export function DashboardMetrics({ dateRange, brandId }: DashboardMetricsProps) {
    const dashboardService = new DashboardService();
    const { selectedAccount } = useAccount();

    const currentFilters = {
        brandId,
        since: dateRange.from?.toISOString().split('T')[0] || '',
        until: dateRange.to?.toISOString().split('T')[0] || '',
        accountId: selectedAccount?.accountId
    };

    const {
        data: dashboardData,
        isLoading,
        error,
        refetch
    } = useDashboardData(currentFilters, {
        enabled: !!dateRange.from && !!dateRange.to && !!selectedAccount
    });

    const handleRefresh = async () => {
        try {
            await refetch();
            toast.success('Métricas atualizadas com sucesso!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar métricas');
        }
    };

    const calculateComparison = (current?: number, previous?: number) => {
        if (!current || !previous || isNaN(current) || isNaN(previous)) return undefined;
        return Number((((current - previous) / previous) * 100).toFixed(1));
    };

    const formatCurrency = (value: number) => {
        if (isNaN(value)) return "R$ 0,00";

        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatNumber = (value: number) => {
        if (isNaN(value)) return "0";

        return value.toLocaleString('pt-BR');
    };

    if (error) {
        return (
            <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
                <h3 className="text-lg font-semibold">Erro ao carregar métricas</h3>
                <p className="text-sm text-gray-500">{error instanceof Error ? error.message : 'Erro desconhecido'}</p>
                <Button onClick={handleRefresh} variant="outline">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Tentar novamente
                </Button>
            </Card>
        );
    }

    const currentData: FacebookCampaignMetrics[] = dashboardData?.current || [];
    const previousData: FacebookCampaignMetrics[] = dashboardData?.previous || [];

    const currentMetrics = dashboardService.calculateAggregatedMetrics(currentData);
    const previousMetrics = previousData.length > 0 ?
        dashboardService.calculateAggregatedMetrics(previousData) :
        undefined;

    const metrics = [
        {
            title: "Gasto Total",
            value: formatCurrency(currentMetrics?.spend || 0),
            comparison: calculateComparison(currentMetrics?.spend, previousMetrics?.spend),
            icon: <DollarSign className="h-5 w-5 text-primary" />,
        },
        {
            title: "Alcance",
            value: formatNumber(currentMetrics?.reach || 0),
            comparison: calculateComparison(currentMetrics?.reach, previousMetrics?.reach),
            icon: <Target className="h-5 w-5 text-primary" />,
        },
        {
            title: "Impressões",
            value: formatNumber(currentMetrics?.impressions || 0),
            comparison: calculateComparison(currentMetrics?.impressions, previousMetrics?.impressions),
            icon: <Eye className="h-5 w-5 text-primary" />,
        },
        {
            title: "Cliques",
            value: formatNumber(currentMetrics?.clicks || 0),
            comparison: calculateComparison(currentMetrics?.clicks, previousMetrics?.clicks),
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