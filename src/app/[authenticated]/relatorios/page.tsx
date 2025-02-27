"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/contexts/AccountContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ReportConfig, type Metric } from "@/components/ReportConfig";
import { CustomReport } from "@/components/CustomReport";
import { Button } from "@/components/ui/button";

export default function Relatorios() {
    const { token } = useAuth();
    const { selectedAccount } = useAccount();
    const router = useRouter();
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

    useEffect(() => {
        if (!token) {
            router.replace("/login");
        }
    }, [token, router]);

    if (!token) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">Redirecionando...</p>
            </div>
        );
    }

    if (!selectedAccount) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <h1 className="text-2xl font-semibold mb-6">Relatórios</h1>
                    <div className="bg-card p-6 rounded-lg shadow-sm border text-center space-y-4">
                        <p className="text-muted-foreground">
                            Você precisa vincular uma conta de anúncios para acessar os relatórios.
                        </p>
                        <Button
                            onClick={() => router.push("/configuracoes")}
                        >
                            Ir para Configurações
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

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