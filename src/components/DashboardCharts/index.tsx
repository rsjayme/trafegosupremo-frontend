"use client";

import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import Link from "next/link";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    type ChartData,
} from "chart.js";
import { useBrand } from "@/contexts/BrandContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { DashboardFilters } from "@/components/DashboardFilters";
import type { DailyInsights } from "@/types/dashboard";
import { useDashboardComparison } from "@/hooks/useDashboardComparison";
import { DashboardComparison } from "@/components/DashboardComparison";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function DashboardCharts() {
    const { selectedBrand, brands, isLoading: brandsLoading } = useBrand();
    const brandId = selectedBrand?.id || 0;

    // Verificação do estado da marca
    const isFacebookConnected = selectedBrand?.facebookAccount?.status === 'active';
    const hasAdAccount = (selectedBrand?.facebookAdAccounts || []).length > 0;
    const isConfigured = !!(selectedBrand && isFacebookConnected && hasAdAccount);

    // Hooks para gerenciamento de dados
    const {
        filters,
        updateDateRange,
        toggleComparison,
        setQuickDateRange,
        setPreviousPeriod,
        setNextPeriod,
        canGoToNextPeriod
    } = useDashboardFilters(brandId);

    const { data: dashboardData, isLoading: dataLoading } = useDashboardData(filters, {
        enabled: isConfigured
    });

    const comparisonData = useDashboardComparison(
        dashboardData?.current,
        dashboardData?.previous
    );

    const isLoading = brandsLoading || dataLoading;

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Verificações de estado em ordem de prioridade
    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="p-4">
                        <div className="animate-pulse">
                            <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div>
                            <div className="h-[200px] bg-gray-100 rounded"></div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (brands.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Nenhuma marca encontrada
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Crie uma marca e conecte-a ao Facebook para visualizar os dados
                    </p>
                    <Link href="/marcas" className="text-primary hover:text-primary/90 underline">
                        Criar marca
                    </Link>
                </div>
            </div>
        );
    }

    if (!selectedBrand) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Selecione uma marca
                    </h2>
                    <p className="text-gray-500">
                        Escolha uma marca no seletor acima para visualizar os dados
                    </p>
                </div>
            </div>
        );
    }

    if (!isConfigured) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Configuração Necessária
                    </h2>
                    <p className="text-gray-500 mb-4">
                        {!isFacebookConnected
                            ? "É necessário ter uma conta do Facebook ativa para acessar o dashboard."
                            : "É necessário conectar uma conta de anúncios do Facebook para visualizar as métricas do dashboard."
                        }
                    </p>
                    <Link
                        href={!isFacebookConnected
                            ? `/marcas/${brandId}`
                            : `/marcas/${brandId}/configurar-anuncios`
                        }
                        className="text-primary hover:text-primary/90 underline"
                    >
                        {!isFacebookConnected
                            ? "Conectar ao Facebook"
                            : "Configurar Conta de Anúncios"
                        }
                    </Link>
                </div>
            </div>
        );
    }

    if (!dashboardData?.current?.daily) {
        return null;
    }

    const dailyData = dashboardData.current.daily;

    const chartConfigs = [
        {
            id: "spend",
            title: "Gasto Diário",
            getData: (data: DailyInsights[]) => data.map(d => d.metrics.spend),
            format: (value: number) =>
                value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                }),
            color: "rgb(99, 102, 241)",
        },
        {
            id: "actions",
            title: "Resultados Diários",
            getData: (data: DailyInsights[]) =>
                data.map(d =>
                    d.metrics.actions
                        .reduce((sum, action) => sum + action.value, 0)
                ),
            format: (value: number) => value.toString(),
            color: "rgb(34, 197, 94)",
        },
        {
            id: "cpc",
            title: "CPC Diário",
            getData: (data: DailyInsights[]) => data.map(d => d.metrics.cpc),
            format: (value: number) =>
                value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                }),
            color: "rgb(234, 179, 8)",
        },
        {
            id: "ctr",
            title: "CTR Diário",
            getData: (data: DailyInsights[]) => data.map(d => d.metrics.ctr),
            format: (value: number) => `${(value * 100).toFixed(2)}%`,
            color: "rgb(249, 115, 22)",
        },
    ];

    const getChartData = (config: typeof chartConfigs[0]): ChartData<"line"> => ({
        labels: dailyData.map(d => d.date),
        datasets: [
            {
                label: config.title,
                data: config.getData(dailyData),
                borderColor: config.color,
                backgroundColor: `${config.color.replace("rgb", "rgba").replace(")", ", 0.5)")}`,
                tension: 0.4,
            },
        ],
    });

    const comparisonMetrics = (() => {
        if (!comparisonData) return null;

        const { totals, derived, overview } = comparisonData;

        const cpaTrend: 'up' | 'down' | 'neutral' =
            derived.cpa.current === derived.cpa.previous ? 'neutral' :
                derived.cpa.current < derived.cpa.previous ? 'down' : 'up';

        return {
            metrics: {
                spend: formatCurrency(totals.current.spend),
                actions: totals.current.actions.toString(),
                cpa: formatCurrency(derived.cpa.current),
                ctr: `${(overview.ctr.percentage).toFixed(2)}%`
            },
            comparisons: {
                spend: overview.spend,
                actions: overview.actions,
                cpa: {
                    percentage: ((derived.cpa.current - derived.cpa.previous) / derived.cpa.previous) * 100,
                    trend: cpaTrend
                },
                ctr: overview.ctr
            }
        };
    })();

    return (
        <div className="space-y-6">
            <DashboardFilters
                since={filters.since}
                until={filters.until}
                onDateChange={updateDateRange}
                onComparisonToggle={toggleComparison}
                onQuickDateSelect={setQuickDateRange}
                onPreviousPeriod={setPreviousPeriod}
                onNextPeriod={setNextPeriod}
                showComparison={filters.comparison || false}
                canGoToNextPeriod={canGoToNextPeriod}
            />

            {filters.comparison && comparisonMetrics && (
                <DashboardComparison {...comparisonMetrics} />
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {chartConfigs.map((config) => (
                    <Card key={config.id} className="p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">
                            {config.title}
                        </h3>
                        <div className="h-[200px]">
                            <Line
                                data={getChartData(config)}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: (context) => {
                                                    const value = context.parsed.y;
                                                    return config.format(value);
                                                },
                                            },
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                callback: (value) => {
                                                    return config.format(value as number);
                                                },
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}