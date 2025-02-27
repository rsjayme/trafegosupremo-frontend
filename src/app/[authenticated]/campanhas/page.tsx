"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from "@/contexts/AccountContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CampaignsTable } from "@/components/CampaignsTable";
import { CampaignFilters } from "@/components/CampaignFilters";

export default function Campanhas() {
    const { token } = useAuth();
    const { selectedAccount } = useAccount();
    const router = useRouter();

    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: undefined,
        to: undefined
    });

    const [status, setStatus] = useState("all");

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

    return (
        <div className="flex-1 p-6">
            <div className="main-container">
                <h1 className="text-2xl font-semibold mb-6">Campanhas</h1>
                {selectedAccount ? (
                    <>
                        <CampaignFilters
                            dateRange={dateRange}
                            onDateChange={setDateRange}
                            status={status}
                            onStatusChange={setStatus}
                        />
                        <CampaignsTable
                            accountId={selectedAccount.id}
                            dateRange={dateRange}
                            status={status}
                        />
                    </>
                ) : (
                    <div className="bg-card p-6 rounded-lg shadow-sm border">
                        <p className="text-muted-foreground">
                            Selecione uma conta no menu superior para visualizar as campanhas
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}