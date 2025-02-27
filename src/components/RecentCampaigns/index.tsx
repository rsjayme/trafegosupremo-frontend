"use client";

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Campaign {
    id: string;
    name: string;
    status: string;
    spent: number;
    results: number;
    ctr: number;
}

interface RecentCampaignsProps {
    limit?: number;
}

export function RecentCampaigns({ limit = 5 }: RecentCampaignsProps) {
    // Mock de campanhas recentes
    const campaigns: Campaign[] = [
        {
            id: "1",
            name: "Campanha de Conversão",
            status: "Ativa",
            spent: 750.50,
            results: 45,
            ctr: 2,
        },
        {
            id: "2",
            name: "Remarketing",
            status: "Ativa",
            spent: 320.75,
            results: 28,
            ctr: 2.12,
        },
        {
            id: "3",
            name: "Prospecção",
            status: "Pausada",
            spent: 1200.25,
            results: 65,
            ctr: 2.08,
        },
    ].slice(0, limit);

    const formatCurrency = (value: number) => {
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const formatPercent = (value: number) => {
        return `${value.toFixed(2)}%`;
    };

    return (
        <Card>
            <div className="p-6">
                <h3 className="text-lg font-medium">Campanhas Recentes</h3>
                <p className="text-sm text-muted-foreground">
                    Últimas campanhas em execução
                </p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Campanha</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Gasto</TableHead>
                        <TableHead className="text-right">Resultados</TableHead>
                        <TableHead className="text-right">CTR</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map((campaign) => (
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
                            <TableCell className="text-right">
                                {formatCurrency(campaign.spent)}
                            </TableCell>
                            <TableCell className="text-right">
                                {campaign.results}
                            </TableCell>
                            <TableCell className="text-right">
                                {formatPercent(campaign.ctr)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}