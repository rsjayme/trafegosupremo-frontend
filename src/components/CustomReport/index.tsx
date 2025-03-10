"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Metric } from "@/components/ReportConfig";
import { Line } from "react-chartjs-2";
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface Campaign {
    id: string;
    name: string;
    status: string;
    budget: number;
    spent: number;
    results: number;
    cpa: number;
    impressions: number;
    clicks: number;
    ctr: number;
}

interface CustomReportProps {
    metrics: Metric[];
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    status: string;
}

// Mock de dados históricos para os gráficos
const historicalData = {
    dates: [
        "2024-02-18",
        "2024-02-19",
        "2024-02-20",
        "2024-02-21",
        "2024-02-22",
        "2024-02-23",
        "2024-02-24",
        "2024-02-25",
    ],
    metrics: {
        budget: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
        spent: [150, 200, 180, 220, 240, 200, 180, 210],
        results: [8, 12, 10, 15, 18, 14, 12, 16],
        impressions: [2000, 2500, 2200, 2800, 3000, 2600, 2400, 2700],
        clicks: [40, 50, 45, 55, 60, 52, 48, 54],
        ctr: [2, 2.2, 2.1, 2.3, 2.4, 2.2, 2.1, 2.3],
        cpa: [18.75, 16.67, 18, 14.67, 13.33, 14.29, 15, 13.13],
    },
};

// Mock de campanhas (mesmo do CampaignsTable)
const allCampaigns: Campaign[] = [
    {
        id: "1",
        name: "Campanha de Conversão",
        status: "Ativa",
        budget: 1000,
        spent: 750.50,
        results: 45,
        cpa: 16.67,
        impressions: 15000,
        clicks: 300,
        ctr: 2,
    },
    {
        id: "2",
        name: "Remarketing",
        status: "Ativa",
        budget: 500,
        spent: 320.75,
        results: 28,
        cpa: 11.45,
        impressions: 8500,
        clicks: 180,
        ctr: 2.12,
    },
    {
        id: "3",
        name: "Prospecção",
        status: "Pausada",
        budget: 1500,
        spent: 1200.25,
        results: 65,
        cpa: 18.46,
        impressions: 25000,
        clicks: 520,
        ctr: 2.08,
    },
];

export function CustomReport({ metrics, status }: CustomReportProps) {
    // Filtra as campanhas com base no status
    const filteredCampaigns = allCampaigns.filter((campaign) => {
        if (status && status !== "all" && campaign.status !== status) {
            return false;
        }
        return true;
    });

    // Funções de formatação
    const formatValue = (value: number, format: "currency" | "number" | "percent") => {
        switch (format) {
            case "currency":
                return value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                });
            case "percent":
                return `${value.toFixed(2)}%`;
            default:
                return value.toLocaleString("pt-BR");
        }
    };

    // Calcula totais
    const totals = filteredCampaigns.reduce(
        (acc, campaign) => {
            metrics.forEach((metric) => {
                const value = campaign[metric.key as keyof Campaign];
                if (typeof value === "number") {
                    acc[metric.key] = (acc[metric.key] || 0) + value;
                }
            });
            return acc;
        },
        {} as Record<string, number>
    );

    // Prepara dados para os gráficos
    const getChartData = (metric: Metric): ChartData<"line"> => {
        const metricData = historicalData.metrics[metric.key as keyof typeof historicalData.metrics];
        if (!metricData) return {
            labels: [],
            datasets: []
        };

        return {
            labels: historicalData.dates,
            datasets: [
                {
                    label: metric.name,
                    data: metricData,
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.5)",
                    tension: 0.4,
                },
            ],
        };
    };

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {metrics.map((metric) => (
                    <Card key={metric.id} className="p-4">
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Total {metric.name}
                            </h3>
                            <p className="text-2xl font-bold">
                                {formatValue(totals[metric.key] || 0, metric.format)}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {metrics.map((metric) => (
                    <Card key={metric.id} className="p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">
                            {metric.name} ao Longo do Tempo
                        </h3>
                        <div className="h-[200px]">
                            <Line
                                data={getChartData(metric)}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            <Card>
                <ScrollArea className="h-[400px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Campanha</TableHead>
                                <TableHead>Status</TableHead>
                                {metrics.map((metric) => (
                                    <TableHead key={metric.id} className="text-right">
                                        {metric.name}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCampaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">
                                        {campaign.name}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === "Ativa"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {campaign.status}
                                        </span>
                                    </TableCell>
                                    {metrics.map((metric) => {
                                        const value = campaign[metric.key as keyof Campaign];
                                        return (
                                            <TableCell key={metric.id} className="text-right">
                                                {typeof value === "number"
                                                    ? formatValue(value, metric.format)
                                                    : "N/A"}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </Card>
        </div>
    );
}