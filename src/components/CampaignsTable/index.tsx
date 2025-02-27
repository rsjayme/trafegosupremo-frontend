"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFacebookData } from "@/hooks/useFacebookData";
import { Campaign } from "@/services/facebook";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

type SortConfig = {
    key: keyof Campaign | null;
    direction: 'asc' | 'desc';
};

interface CampaignsTableProps {
    accountId: string;
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
    status: string;
}

export function CampaignsTable({ accountId, dateRange, status }: CampaignsTableProps) {
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        key: null,
        direction: 'asc'
    });

    const {
        campaigns,
        isLoading,
        error,
        refreshData
    } = useFacebookData({
        autoLoad: true,
        accountId,
        dateRange: dateRange.from && dateRange.to ? {
            since: dateRange.from.toISOString().split('T')[0],
            until: dateRange.to.toISOString().split('T')[0]
        } : undefined
    });

    const requestSort = (key: keyof Campaign) => {
        let direction: 'asc' | 'desc' = 'asc';

        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const handleRefresh = async () => {
        try {
            await refreshData();
            toast.success('Dados atualizados com sucesso!');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Erro ao atualizar dados');
        }
    };

    // Função para ordenar as campanhas
    const sortCampaigns = (campaigns: Campaign[]) => {
        if (!sortConfig.key) return campaigns;

        return [...campaigns].sort((a, b) => {
            if (a[sortConfig.key!] < b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key!] > b[sortConfig.key!]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Filtra as campanhas com base no status selecionado
    const filteredCampaigns = campaigns.filter(campaign => {
        if (status && status !== "all" && campaign.status !== status) {
            return false;
        }
        return true;
    });

    // Aplica a ordenação nas campanhas filtradas
    const sortedCampaigns = sortCampaigns(filteredCampaigns);

    const getSortIcon = (key: keyof Campaign) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
        }
        return sortConfig.direction === 'asc'
            ? <ArrowUp className="ml-2 h-4 w-4" />
            : <ArrowDown className="ml-2 h-4 w-4" />;
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const renderErrorState = () => (
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="text-lg font-semibold">Erro ao carregar campanhas</h3>
            <p className="text-sm text-gray-500">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Tentar novamente
            </Button>
        </Card>
    );

    const renderLoadingState = () => (
        <TableRow>
            <TableCell colSpan={7} className="h-32 text-center">
                <RefreshCcw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                <span className="mt-2 text-sm text-gray-500 block">
                    Carregando campanhas...
                </span>
            </TableCell>
        </TableRow>
    );

    const renderEmptyState = () => (
        <TableRow>
            <TableCell colSpan={7} className="h-32 text-center">
                <p className="text-sm text-gray-500">
                    Nenhuma campanha encontrada
                </p>
            </TableCell>
        </TableRow>
    );

    if (error) {
        return renderErrorState();
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button
                    onClick={handleRefresh}
                    variant="outline"
                    disabled={isLoading}
                >
                    <RefreshCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Atualizando...' : 'Atualizar'}
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('name')}
                                    className="p-0 hover:bg-transparent"
                                >
                                    Nome da Campanha
                                    {getSortIcon('name')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('status')}
                                    className="p-0 hover:bg-transparent"
                                >
                                    Status
                                    {getSortIcon('status')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('daily_budget')}
                                    className="p-0 hover:bg-transparent ml-auto"
                                >
                                    Orçamento Diário
                                    {getSortIcon('daily_budget')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button
                                    variant="ghost"
                                    onClick={() => requestSort('lifetime_budget')}
                                    className="p-0 hover:bg-transparent ml-auto"
                                >
                                    Orçamento Total
                                    {getSortIcon('lifetime_budget')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">Data de Início</TableHead>
                            <TableHead className="text-right">Data de Término</TableHead>
                            <TableHead className="text-right">Objetivo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            renderLoadingState()
                        ) : sortedCampaigns.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            sortedCampaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">
                                        {campaign.name}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${campaign.status === "ACTIVE"
                                                    ? "bg-green-100 text-green-700"
                                                    : campaign.status === "PAUSED"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {campaign.status === "ACTIVE"
                                                ? "Ativa"
                                                : campaign.status === "PAUSED"
                                                    ? "Pausada"
                                                    : "Inativa"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {campaign.daily_budget ? formatCurrency(campaign.daily_budget) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {campaign.lifetime_budget ? formatCurrency(campaign.lifetime_budget) : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {new Date(campaign.start_time).toLocaleDateString('pt-BR')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {campaign.end_time
                                            ? new Date(campaign.end_time).toLocaleDateString('pt-BR')
                                            : '-'
                                        }
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {campaign.objective}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
