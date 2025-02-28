"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type FacebookCampaignMetrics, type DashboardFilters } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DashboardCampaignsProps {
    brandId: number;
    since: string;
    until: string;
}

export function DashboardCampaigns({ brandId, since, until }: DashboardCampaignsProps) {
    const filters: DashboardFilters = {
        brandId,
        since,
        until
    };

    const { data, isLoading } = useDashboardData(filters, {
        enabled: !!brandId && !!since && !!until
    });

    const formatCurrency = (value: string) => {
        const number = Number(value);
        if (isNaN(number)) return "R$ 0,00";

        return number.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

    const formatNumber = (value: string) => {
        const number = Number(value);
        if (isNaN(number)) return "0";

        return number.toLocaleString("pt-BR");
    };

    const formatPercent = (value: string) => {
        const number = Number(value);
        if (isNaN(number)) return "0,00%";

        return `${number.toFixed(2).replace('.', ',')}%`;
    };

    const campaigns = data?.current || [];

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
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </ScrollArea>
            </Card>
        );
    }

    if (campaigns.length === 0) {
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
        <Card>
            <div className="p-6 border-b">
                <h3 className="text-lg font-medium">Campanhas</h3>
                <p className="text-sm text-muted-foreground">
                    Detalhes de todas as campanhas ativas no período
                </p>
            </div>
            <ScrollArea className="h-[400px]">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[300px]">Campanha</TableHead>
                            <TableHead className="text-right font-medium">Gasto</TableHead>
                            <TableHead className="text-right font-medium">Alcance</TableHead>
                            <TableHead className="text-right font-medium">Impressões</TableHead>
                            <TableHead className="text-right font-medium">Cliques</TableHead>
                            <TableHead className="text-right font-medium">CTR</TableHead>
                            <TableHead className="text-right font-medium">CPC</TableHead>
                            <TableHead className="text-right font-medium">CPM</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaigns.map((campaign: FacebookCampaignMetrics) => (
                            <TableRow
                                key={`${campaign.account_id}-${campaign.campaign_name}`}
                                className="group hover:bg-muted/50 transition-colors"
                            >
                                <TableCell className="max-w-[300px]">
                                    <div>
                                        <p className="font-medium truncate" title={campaign.campaign_name}>
                                            {campaign.campaign_name}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            ID: {campaign.account_id}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    <span className="font-medium text-green-600">
                                        {formatCurrency(campaign.spend)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatNumber(campaign.reach)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatNumber(campaign.impressions)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatNumber(campaign.clicks)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    <span className={cn(
                                        "px-2 py-1 rounded-full text-xs font-medium",
                                        Number(campaign.ctr) > 2
                                            ? "bg-green-100 text-green-700"
                                            : Number(campaign.ctr) > 1
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                    )}>
                                        {formatPercent(campaign.ctr)}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatCurrency(campaign.cpc)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {formatCurrency(campaign.cpm)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </Card>
    );
}