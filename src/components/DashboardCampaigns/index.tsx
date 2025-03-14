"use client";

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type FacebookCampaignMetrics, type DashboardFilters } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { CampaignItem } from "./CampaignItem";
import { useDashboardData } from "@/hooks/useDashboardData";
import { loadGlobalActions, saveGlobalActions } from "./storage";
import { useAccount } from "@/contexts/AccountContext";

interface DashboardCampaignsProps {
    brandId: number;
    since: string;
    until: string;
}

export function DashboardCampaigns({ brandId, since, until }: DashboardCampaignsProps) {
    const { selectedAccount } = useAccount();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [globalActions, setGlobalActions] = useState<string[]>(() =>
        loadGlobalActions()
    );
    const [campaignActions, setCampaignActions] = useState<Record<string, string[]>>({});

    useEffect(() => {
        saveGlobalActions(globalActions);
    }, [globalActions]);

    const handleCampaignActionChange = (campaignId: string, actions: string[]) => {
        setCampaignActions(prev => ({
            ...prev,
            [campaignId]: actions
        }));
    };

    const filters: DashboardFilters = {
        brandId,
        since,
        until,
        accountId: selectedAccount?.accountId
    };

    const queryEnabled = !!brandId && !!since && !!until && !!selectedAccount?.accountId;

    const { data, isLoading } = useDashboardData(filters, {
        enabled: queryEnabled
    });

    if (!queryEnabled) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-muted-foreground">
                        Selecione uma conta no menu superior para visualizar as campanhas
                    </p>
                </div>
            </Card>
        );
    }

    if (isLoading) {
        return (
            <Card>
                <div className="p-6 border-b">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-2/4 mt-2" />
                </div>
                <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-6 w-1/3" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        );
    }

    if (!data?.current?.length) {
        return (
            <Card className="p-6">
                <div className="text-center space-y-2">
                    <p className="text-lg font-medium text-muted-foreground">
                        Nenhuma campanha encontrada
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Não existem campanhas ativas no período selecionado
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium">Campanhas</h3>
                    <p className="text-sm text-muted-foreground">
                        {data.current.length} campanha{data.current.length === 1 ? '' : 's'} ativa{data.current.length === 1 ? '' : 's'} no período
                    </p>
                </div>
            </div>

            <ScrollArea className="h-[600px]">
                <div className="divide-y">
                    {data.current.map((campaign: FacebookCampaignMetrics) => (
                        <CampaignItem
                            key={`${campaign.account_id}-${campaign.campaign_name}`}
                            campaign={campaign}
                            globalActions={globalActions}
                            campaignActions={campaignActions}
                            onCampaignActionChange={handleCampaignActionChange}
                            since={since}
                            until={until}
                        />
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}