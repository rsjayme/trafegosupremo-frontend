"use client";

import { useAccount } from "@/contexts/AccountContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { DashboardCharts } from "@/components/DashboardCharts";
import { RecentCampaigns } from "@/components/RecentCampaigns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
    const { selectedAccount } = useAccount();
    const router = useRouter();
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    if (!selectedAccount) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                    <div className="bg-card p-6 rounded-lg shadow-sm border text-center space-y-4">
                        <p className="text-muted-foreground">
                            Você precisa vincular uma conta de anúncios para acessar o dashboard.
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
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <div className="w-[300px]">
                        <DateRangePicker
                            date={dateRange}
                            onDateChange={setDateRange}
                        />
                    </div>
                </div>

                <DashboardMetrics
                    dateRange={dateRange}
                    accountId={selectedAccount.id}
                />

                <DashboardCharts dateRange={dateRange} />

                <RecentCampaigns />

                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/campanhas")}
                    >
                        Ver Todas as Campanhas
                    </Button>
                </div>
            </div>
        </div>
    );
}