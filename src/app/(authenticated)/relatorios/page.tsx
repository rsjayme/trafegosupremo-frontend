"use client";

import { useState } from "react";
import { ReportConfig, type Metric } from "@/components/ReportConfig";
import { CustomReport } from "@/components/CustomReport";

export default function Relatorios() {
    const [config, setConfig] = useState<{
        metrics: Metric[];
        dateRange: { from: Date | undefined; to: Date | undefined };
        status: string;
    }>({
        metrics: [
            { id: "1", name: "Orçamento", key: "budget", format: "currency" },
            { id: "2", name: "Gasto", key: "spent", format: "currency" },
            { id: "3", name: "Resultados", key: "results", format: "number" },
            { id: "4", name: "CPA", key: "cpa", format: "currency" },
            { id: "5", name: "Impressões", key: "impressions", format: "number" },
            { id: "6", name: "Cliques", key: "clicks", format: "number" },
            { id: "7", name: "CTR", key: "ctr", format: "percent" },
        ],
        dateRange: {
            from: undefined,
            to: undefined,
        },
        status: "all",
    });

    return (
        <div className="flex-1 p-6">
            <div className="main-container space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Relatórios</h1>
                </div>

                <ReportConfig
                    onConfigChange={(newConfig) => {
                        setConfig(newConfig);
                    }}
                />

                <CustomReport
                    metrics={config.metrics}
                    dateRange={config.dateRange}
                    status={config.status}
                />
            </div>
        </div>
    );
}