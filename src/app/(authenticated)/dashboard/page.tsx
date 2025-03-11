"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { DashboardCampaigns } from "@/components/DashboardCampaigns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { useBrand } from "@/contexts/BrandContext";

export default function Dashboard() {
    const { selectedBrand } = useBrand();
    const router = useRouter();
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined,
    });

    if (!selectedBrand) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                    <div className="bg-card p-6 rounded-lg shadow-sm border text-center space-y-4">
                        <p className="text-muted-foreground">
                            Você precisa vincular uma conta de anúncios a uma marca para acessar o Dashboard.
                        </p>
                        <Button
                            onClick={() => router.push("/marcas")}
                        >
                            Ir para Marcas
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const isConfigured = !!(
        selectedBrand?.facebookAccount?.status === 'active' &&
        (selectedBrand?.facebookAdAccounts || []).length > 0
    );

    if (!isConfigured) {
        return (
            <div className="flex-1 p-6">
                <div className="main-container">
                    <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
                    <div className="bg-card p-6 rounded-lg shadow-sm border text-center space-y-4">
                        <p className="text-muted-foreground">
                            {!selectedBrand.facebookAccount?.status
                                ? "É necessário ter uma conta do Facebook ativa para acessar o dashboard."
                                : "É necessário conectar uma conta de anúncios do Facebook para visualizar as métricas do dashboard."
                            }
                        </p>
                        <Button
                            onClick={() => router.push(
                                !selectedBrand.facebookAccount?.status
                                    ? `/marcas/${selectedBrand.id}`
                                    : `/marcas/${selectedBrand.id}/configurar-anuncios`
                            )}
                        >
                            {!selectedBrand.facebookAccount?.status
                                ? "Conectar ao Facebook"
                                : "Configurar Conta de Anúncios"
                            }
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const since = dateRange.from?.toISOString().split('T')[0] || '';
    const until = dateRange.to?.toISOString().split('T')[0] || '';

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
                    brandId={selectedBrand.id}
                />

                {dateRange.from && dateRange.to && (
                    <DashboardCampaigns
                        brandId={selectedBrand.id}
                        since={since}
                        until={until}
                    />
                )}
            </div>
        </div>
    );
}