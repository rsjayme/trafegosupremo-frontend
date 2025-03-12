'use client';

import { forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { LeadFormDialog } from './LeadFormDialog';

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

interface LeadCardProps {
    lead: Lead;
    onUpdate: (id: number, data: Partial<Lead>) => void;
}

const priorityColors = {
    BAIXA: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    MEDIA: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    ALTA: 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
};

export const LeadCard = forwardRef<HTMLDivElement, LeadCardProps>(function LeadCard({ lead, onUpdate }, ref) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'LEAD',
        item: { id: lead.id, status: lead.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    return (
        <LeadFormDialog
            trigger={
                <div>
                    <Card
                        ref={(node) => {
                            if (ref) {
                                if (typeof ref === 'function') {
                                    ref(node);
                                } else {
                                    ref.current = node;
                                }
                            }
                            drag(node);
                        }}
                        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                        style={{ opacity: isDragging ? 0.5 : 1 }}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Badge className={priorityColors[lead.priority]}>
                                    {lead.priority}
                                </Badge>
                                <span className="text-sm font-medium">
                                    {formatCurrency(lead.value)}
                                </span>
                            </div>

                            <div>
                                <h4 className="font-medium truncate">{lead.contactName}</h4>
                                <p className="text-sm text-muted-foreground truncate">
                                    {lead.companyName}
                                </p>
                            </div>

                            <div className="text-xs text-muted-foreground space-y-1">
                                <p className="truncate">Email: {lead.email}</p>
                                <p>Telefone: {lead.phone}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            }
            defaultValues={lead}
            onSubmit={(data) => onUpdate(lead.id, data)}
        />
    );
});