"use client";

import { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ReportsSidebar } from "@/components/ReportsSidebar";
import { ReportsCanvas } from "@/components/ReportsCanvas";
import { DashboardFilters } from "@/components/DashboardFilters";
import { addDays, subDays, format } from "date-fns";
import { useBrand } from "@/contexts/BrandContext";
import { FacebookInsightsService, InsightsDaily, InsightsDemographics, InsightsOverview } from "@/services/facebook-insights";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import type { Account, MockData } from "@/mock/reports-data";

// Constantes
const DEFAULT_DAYS = 30;

const DEFAULT_TIMELINE_DATA = {
    dates: [],
    metrics: {
        impressions: [],
        clicks: [],
        spend: [],
        ctr: [],
        cpc: [],
        cpm: []
    }
};

const DEFAULT_ACCOUNT: Account = {
    id: "1",
    name: "Conta Principal",
    metrics: {
        impressions: 0,
        clicks: 0,
        spend: 0,
        results: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0,
        cpm: 0
    },
    actions: [],
    demographics: {
        age: {},
        gender: {},
        location: {}
    },
    daily: DEFAULT_TIMELINE_DATA
};

export interface Widget {
    id: string;
    type: "overview" | "pieChart" | "funnel" | "lineChart" | "barChart";
    title: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    config: {
        level: "account" | "campaign";
        metrics?: string[];
        demographic?: string;
        funnelMetrics?: string[];
        campaignId?: string;
        dateRange: {
            start: Date | null;
            end: Date | null;
        };
    };
}

/**
 * Página de Relatórios que permite visualizar e configurar widgets
 * com dados do Facebook Ads
 */
export default function Relatorios() {
    const [widgets, setWidgets] = useState<Widget[]>([]);
    const [since, setSince] = useState(() => format(subDays(new Date(), DEFAULT_DAYS), 'yyyy-MM-dd'));
    const [until, setUntil] = useState(() => format(new Date(), 'yyyy-MM-dd'));
    const [showComparison, setShowComparison] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { selectedBrand } = useBrand();
    const insights = new FacebookInsightsService();

    // Estado para armazenar os dados da API
    const [insightsData, setInsightsData] = useState<{
        overview: InsightsOverview[] | null;
        daily: InsightsDaily[] | null;
        demographics: InsightsDemographics[] | null;
    }>({
        overview: null,
        daily: null,
        demographics: null
    });

    // Carrega dados quando a marca ou datas mudarem
    useEffect(() => {
        const loadInsights = async () => {
            if (!selectedBrand?.id) return;

            setIsLoading(true);
            setError(null);

            try {
                const brandIdString = String(selectedBrand.id);
                const [overview, daily, demographics] = await Promise.all([
                    insights.getOverview(brandIdString, since, until),
                    insights.getDaily(brandIdString, since, until),
                    insights.getDemographics(brandIdString, since, until)
                ]);

                console.log('Dados diários recebidos:', daily);

                setInsightsData({
                    overview,
                    daily,
                    demographics
                });
            } catch (err) {
                console.error('Erro ao carregar insights:', err);
                setError('Erro ao carregar dados do Facebook');
            } finally {
                setIsLoading(false);
            }
        };

        loadInsights();
    }, [selectedBrand?.id, since, until]);

    const handleDateChange = (newSince: Date, newUntil: Date) => {
        setSince(format(newSince, 'yyyy-MM-dd'));
        setUntil(format(newUntil, 'yyyy-MM-dd'));
    };

    const handleQuickDateSelect = (days: number) => {
        const newUntil = new Date();
        const newSince = subDays(newUntil, days);
        setSince(format(newSince, 'yyyy-MM-dd'));
        setUntil(format(newUntil, 'yyyy-MM-dd'));
    };

    const handlePreviousPeriod = () => {
        const currentSince = new Date(since);
        const currentUntil = new Date(until);
        const diff = currentUntil.getTime() - currentSince.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        const newUntil = currentSince;
        const newSince = subDays(newUntil, days);

        setSince(format(newSince, 'yyyy-MM-dd'));
        setUntil(format(newUntil, 'yyyy-MM-dd'));
    };

    const handleNextPeriod = () => {
        const currentSince = new Date(since);
        const currentUntil = new Date(until);
        const diff = currentUntil.getTime() - currentSince.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        const newSince = currentUntil;
        const newUntil = addDays(newSince, days);

        setSince(format(newSince, 'yyyy-MM-dd'));
        setUntil(format(newUntil, 'yyyy-MM-dd'));
    };

    const canGoToNextPeriod = new Date(until) < new Date();

    const handleAddWidget = (widget: Widget) => {
        setWidgets((prev) => [...prev, widget]);
    };

    const handleUpdateWidget = (id: string, updates: Partial<Widget>) => {
        setWidgets((prev) =>
            prev.map((widget) =>
                widget.id === id ? { ...widget, ...updates } : widget
            )
        );
    };

    const handleRemoveWidget = (id: string) => {
        setWidgets((prev) => prev.filter((widget) => widget.id !== id));
    };

    /**
     * Adapta os dados do insight para o formato esperado pelo ReportsCanvas
     */
    const adaptDataForCanvas = (): MockData => {
        const overview = insightsData.overview?.[0];
        const daily = insightsData.daily;
        const demographics = insightsData.demographics;

        console.log('Adaptando dados - Overview:', overview);
        console.log('Adaptando dados - Daily:', daily);

        // Dados básicos da conta
        const account: Account = {
            id: String(selectedBrand?.id || DEFAULT_ACCOUNT.id),
            name: selectedBrand?.name || DEFAULT_ACCOUNT.name,
            metrics: {
                impressions: overview ? insights.formatValue(overview.impressions) : 0,
                clicks: overview ? insights.formatValue(overview.clicks) : 0,
                spend: overview ? insights.formatValue(overview.spend) : 0,
                ctr: overview ? insights.formatValue(overview.ctr) : 0,
                cpc: overview ? insights.formatValue(overview.cpc) : 0,
                cpm: overview ? insights.formatValue(overview.cpm) : 0,
                results: 0,
                cpa: 0
            },
            actions: overview?.actions || [],
            demographics: {
                age: demographics ? insights.groupByAge(demographics) : {},
                gender: demographics ? insights.groupByGender(demographics) : {},
                location: {}
            },
            daily: daily ? insights.formatTimelineData(daily) : DEFAULT_TIMELINE_DATA
        };

        console.log('Dados diários formatados:', account.daily);

        return {
            accounts: [account],
            campaigns: [],
            since,
            until
        };
    };

    if (!selectedBrand) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Selecione uma marca para visualizar os relatórios</p>
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-1 h-full">
                <ReportsSidebar onAddWidget={handleAddWidget} />
                <div className="flex-1 p-6">
                    <div className="main-container space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h1 className="text-2xl font-semibold">Relatórios</h1>
                            </div>
                            <DashboardFilters
                                since={since}
                                until={until}
                                onDateChange={handleDateChange}
                                onComparisonToggle={() => setShowComparison(!showComparison)}
                                onQuickDateSelect={handleQuickDateSelect}
                                onPreviousPeriod={handlePreviousPeriod}
                                onNextPeriod={handleNextPeriod}
                                showComparison={showComparison}
                                canGoToNextPeriod={canGoToNextPeriod}
                            />
                        </div>
                        {isLoading ? (
                            <LoadingOverlay />
                        ) : error ? (
                            <div className="flex items-center justify-center h-64">
                                <p className="text-red-500">{error}</p>
                            </div>
                        ) : (
                            <ReportsCanvas
                                widgets={widgets}
                                onUpdateWidget={handleUpdateWidget}
                                onRemoveWidget={handleRemoveWidget}
                                onAddWidget={handleAddWidget}
                                data={adaptDataForCanvas()}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}