"use client";

import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
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
        campaignId?: string; // Mantido para compatibilidade
        campaignIds?: string[]; // Nova propriedade para múltiplas campanhas
        breakdown?: "demographics" | "devices" | "locations";
        metric?: string;
        dateRange: {
            start: Date | null;
            end: Date | null;
        };
    };
}

interface MetricTotals {
    impressions: number;
    clicks: number;
    spend: number;
    actions: any[];
    cost_per_action_type: any[];
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
    const [isExporting, setIsExporting] = useState(false);

    const { selectedBrand } = useBrand();

    const handleExportPDF = useCallback(async () => {
        if (!selectedBrand?.name) return;

        try {
            setIsExporting(true);
            const element = document.getElementById('reports-canvas');
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`relatorio-${selectedBrand.name.toLowerCase()}-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
        } catch (err) {
            console.error('Erro ao exportar PDF:', err);
            setError('Erro ao gerar PDF');
        } finally {
            setIsExporting(false);
        }
    }, [selectedBrand?.name]);

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
     * Agrega dados de todas as campanhas
     */
    const aggregateOverviewMetrics = (data: InsightsOverview[] | null): InsightsOverview | null => {
        if (!data?.length) return null;

        // Primeiro soma todas as métricas básicas
        const totals = data.reduce<MetricTotals>((acc, curr) => ({
            impressions: acc.impressions + parseFloat(curr.impressions || '0'),
            clicks: acc.clicks + parseFloat(curr.clicks || '0'),
            spend: acc.spend + parseFloat(curr.spend || '0'),
            actions: [...acc.actions, ...(curr.actions || [])],
            cost_per_action_type: [...acc.cost_per_action_type, ...(curr.cost_per_action_type || [])]
        }), {
            impressions: 0,
            clicks: 0,
            spend: 0,
            actions: [],
            cost_per_action_type: []
        });

        // Depois calcula as taxas baseadas nos totais
        const ctr = totals.clicks && totals.impressions ? (totals.clicks / totals.impressions) * 100 : 0;
        const cpc = totals.clicks && totals.spend ? totals.spend / totals.clicks : 0;
        const cpm = totals.impressions ? (totals.spend / totals.impressions) * 1000 : 0;

        const aggregated: InsightsOverview = {
            ...data[0], // Mantém outros campos necessários
            impressions: totals.impressions.toString(),
            clicks: totals.clicks.toString(),
            spend: totals.spend.toString(),
            ctr: ctr.toString(),
            cpc: cpc.toString(),
            cpm: cpm.toString(),
            actions: totals.actions,
            cost_per_action_type: totals.cost_per_action_type
        };

        return aggregated;
    };

    /**
     * Agrega dados diários de todas as campanhas
     */
    const aggregateDailyMetrics = (data: InsightsDaily[] | null): InsightsDaily[] | null => {
        if (!data?.length) return null;

        const dailyTotals = new Map<string, {
            impressions: number;
            clicks: number;
            spend: number;
            date_start: string;
            date_stop: string;
        }>();

        // Soma métricas por dia
        data.forEach(item => {
            const existing = dailyTotals.get(item.date_start) || {
                impressions: 0,
                clicks: 0,
                spend: 0,
                date_start: item.date_start,
                date_stop: item.date_stop
            };

            dailyTotals.set(item.date_start, {
                ...existing,
                impressions: existing.impressions + parseFloat(item.impressions || '0'),
                clicks: existing.clicks + parseFloat(item.clicks || '0'),
                spend: existing.spend + parseFloat(item.spend || '0')
            });
        });

        // Converte para array e calcula taxas
        return Array.from(dailyTotals.values()).map(daily => {
            const ctr = daily.clicks && daily.impressions ? (daily.clicks / daily.impressions) * 100 : 0;
            const cpc = daily.clicks && daily.spend ? daily.spend / daily.clicks : 0;
            const cpm = daily.impressions ? (daily.spend / daily.impressions) * 1000 : 0;

            return {
                ...data[0], // Mantém outros campos necessários
                date_start: daily.date_start,
                date_stop: daily.date_stop,
                impressions: daily.impressions.toString(),
                clicks: daily.clicks.toString(),
                spend: daily.spend.toString(),
                ctr: ctr.toString(),
                cpc: cpc.toString(),
                cpm: cpm.toString()
            };
        });
    };

    /**
     * Adapta os dados do insight para o formato esperado pelo ReportsCanvas
     */
    const adaptDataForCanvas = (): MockData => {
        const overview = aggregateOverviewMetrics(insightsData.overview);
        const daily = aggregateDailyMetrics(insightsData.daily);
        const demographics = insightsData.demographics;

        console.log('Adaptando dados - Overview agregado:', overview);
        console.log('Adaptando dados - Daily agregado:', daily);

        // Preparar dados das campanhas individuais
        const campaigns = insightsData.overview || [];

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
            campaigns: campaigns || [], // Inclui todas as campanhas dos insights
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
                                <Button
                                    onClick={handleExportPDF}
                                    variant="outline"
                                    disabled={isExporting}
                                >
                                    {isExporting ? "Gerando PDF..." : "Exportar PDF"}
                                </Button>
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