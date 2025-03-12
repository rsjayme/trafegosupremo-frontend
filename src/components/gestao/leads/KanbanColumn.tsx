'use client';

import { forwardRef } from 'react';
import { useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { LeadCard } from './LeadCard';

interface Lead {
    id: number;
    status: 'LEAD' | 'PROPOSTA_ENVIADA' | 'FECHADO' | 'NAO_FECHADO';
    priority: 'BAIXA' | 'MEDIA' | 'ALTA';
    contactName: string;
    companyName: string;
    value: number;
    email: string;
    phone: string;
    lastContactDate: string;
    nextContactDate: string;
    observations?: string;
}

interface KanbanColumnProps {
    title: string;
    status: Lead['status'];
    leads: Lead[];
    onDrop: (leadId: number, newStatus: Lead['status']) => void;
    onUpdate: (id: number, data: Partial<Lead>) => void;
}

const statusColors = {
    LEAD: 'border-blue-500/20',
    PROPOSTA_ENVIADA: 'border-yellow-500/20',
    FECHADO: 'border-green-500/20',
    NAO_FECHADO: 'border-red-500/20'
};

export const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(
    function KanbanColumn({ title, status, leads, onDrop, onUpdate }, ref) {
        const [{ isOver }, drop] = useDrop(() => ({
            accept: 'LEAD',
            drop: (item: { id: number }) => {
                onDrop(item.id, status);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver()
            })
        }));

        return (
            <div
                ref={(node) => {
                    // Combina o ref do forwardRef com o ref do react-dnd
                    if (ref) {
                        if (typeof ref === 'function') {
                            ref(node);
                        } else {
                            ref.current = node;
                        }
                    }
                    drop(node);
                }}
                className="flex-1 min-w-[300px] max-w-[350px]"
            >
                <div className="mb-3">
                    <h3 className="font-medium">{title}</h3>
                    <div className="text-sm text-muted-foreground">
                        {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
                    </div>
                </div>

                <Card
                    className={`h-[calc(100vh-13rem)] p-2 overflow-y-auto space-y-2 border-2 ${statusColors[status]
                        } ${isOver ? 'bg-muted/50' : ''}`}
                >
                    {leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onUpdate={onUpdate}
                        />
                    ))}

                    {leads.length === 0 && (
                        <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            Nenhum lead nesta coluna
                        </div>
                    )}
                </Card>
            </div>
        );
    }
);