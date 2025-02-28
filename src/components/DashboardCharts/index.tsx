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
    const { selectedBrand, brands, isLoading } = useBrand();

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
                    <Link
                        href="/marcas"
                        className="text-primary hover:text-primary/90 underline"
                    >
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

    if (!selectedBrand.facebookAccount) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Conexão necessária
                    </h2>
                    <p className="text-gray-500 mb-4">
                        Conecte esta marca ao Facebook para visualizar os dados
                    </p>
                    <Link
                        href={`/marcas/${selectedBrand.id}`}
                        className="text-primary hover:text-primary/90 underline"
                    >
                        Conectar ao Facebook
                    </Link>
                </div>
            </div>
        );
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
            spent: [150, 200, 180, 220, 240, 200, 180, 210],
            results: [8, 12, 10, 15, 18, 14, 12, 16],
            cpa: [18.75, 16.67, 18, 14.67, 13.33, 14.29, 15, 13.13],
            ctr: [2, 2.2, 2.1, 2.3, 2.4, 2.2, 2.1, 2.3],
        },
    };

    const chartConfigs = [
        {
            id: "spent",
            title: "Gasto Diário",
            data: historicalData.metrics.spent,
            format: (value: number) =>
                value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                }),
            color: "rgb(99, 102, 241)",
        },
        {
            id: "results",
            title: "Resultados Diários",
            data: historicalData.metrics.results,
            format: (value: number) => value.toString(),
            color: "rgb(34, 197, 94)",
        },
        {
            id: "cpa",
            title: "CPA Diário",
            data: historicalData.metrics.cpa,
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
            data: historicalData.metrics.ctr,
            format: (value: number) => `${value.toFixed(2)}%`,
            color: "rgb(249, 115, 22)",
        },
    ];

    const getChartData = (config: typeof chartConfigs[0]): ChartData<"line"> => {
        return {
            labels: historicalData.dates,
            datasets: [
                {
                    label: config.title,
                    data: config.data,
                    borderColor: config.color,
                    backgroundColor: `${config.color.replace("rgb", "rgba").replace(")", ", 0.5)")}`,
                    tension: 0.4,
                },
            ],
        };
    };

    return (
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
    );
}