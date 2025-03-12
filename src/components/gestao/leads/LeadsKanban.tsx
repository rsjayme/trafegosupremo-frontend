'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLeads } from '@/hooks/useLeads';
import { KanbanColumn } from './KanbanColumn';
import { LeadsDateFilter } from './LeadsDateFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { endOfDay, isValid, isWithinInterval, parseISO, startOfDay } from 'date-fns';
import type {
    APILead,
    LeadStatus,
    LeadsFilter,
    KanbanData
} from '@/lib/types/lead';

const statusMapping: Record<LeadStatus, string> = {
    LEAD: 'Leads',
    PROPOSTA_ENVIADA: 'Propostas Enviadas',
    FECHADO: 'Fechados',
    NAO_FECHADO: 'Não Fechados'
};

export function LeadsKanban() {
    const { kanban, isLoading, updateLead } = useLeads();
    const [dateFilter, setDateFilter] = useState<LeadsFilter>({
        dateField: 'createdAt',
        range: undefined
    });

    if (isLoading) {
        return (
            <div className="flex flex-col">
                <div className="h-[72px] border-b bg-muted/30 animate-pulse" />
                <div className="flex gap-4 p-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex-1 min-w-[300px] max-w-[350px]">
                            <Skeleton className="h-8 w-32 mb-3" />
                            <Skeleton className="h-[calc(100vh-13rem)] w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const handleDrop = (leadId: number, newStatus: LeadStatus) => {
        updateLead({
            id: leadId,
            data: { status: newStatus },
            showToast: false
        });
    };

    const handleUpdate = (id: number, data: Partial<APILead>) => {
        updateLead({
            id,
            data,
            showToast: true
        });
    };

    const filterLeads = (leads: APILead[]) => {
        if (!dateFilter.range?.from || !dateFilter.range?.to) {
            return leads;
        }

        const startDate = startOfDay(dateFilter.range.from);
        const endDate = endOfDay(dateFilter.range.to);

        return leads.filter(lead => {
            let dateToFilter: string;

            // Determina qual data usar baseado no campo selecionado
            if (dateFilter.dateField === 'createdAt') {
                dateToFilter = lead.createdAt; // createdAt sempre existe
            } else {
                dateToFilter = lead[dateFilter.dateField];
                if (!dateToFilter) return false;
            }

            const leadDate = parseISO(dateToFilter);
            if (!isValid(leadDate)) return false;

            return isWithinInterval(leadDate, {
                start: startDate,
                end: endDate
            });
        });
    };

    const handleFilterChange = (filter: LeadsFilter) => {
        setDateFilter(filter);
    };

    const kanbanData = kanban || {} as KanbanData;

    return (
        <div className="flex flex-col h-full">
            <LeadsDateFilter
                onFilterChange={handleFilterChange}
            />
            <DndProvider backend={HTML5Backend}>
                <div className="flex gap-4 p-4">
                    {(Object.keys(statusMapping) as LeadStatus[]).map((status) => (
                        <KanbanColumn
                            key={status}
                            title={statusMapping[status]}
                            status={status}
                            leads={filterLeads(kanbanData[status] || [])}
                            onDrop={handleDrop}
                            onUpdate={handleUpdate}
                        />
                    ))}
                </div>
            </DndProvider>
        </div>
    );
}