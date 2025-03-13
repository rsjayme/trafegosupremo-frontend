'use client';

import { useDrag } from 'react-dnd';
import { useRef } from 'react';
import { numberToCurrency, formatPhone } from '@/lib/utils';
import { LeadFormDialog } from './LeadFormDialog';
import { CalendarIcon, PhoneIcon, Trash2 } from 'lucide-react';
import type { APILead, LeadFormData } from '@/lib/types/lead';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/components/ui/card';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface LeadCardProps {
    lead: APILead;
    onUpdate: (id: number, data: Partial<LeadFormData>) => void;
    onDelete?: (id: number) => void;
}

// Converte o lead da API para o formato do formulário
const convertToFormData = (lead: APILead): LeadFormData => ({
    status: lead.status,
    priority: lead.priority,
    contactName: lead.contactName,
    companyName: lead.companyName,
    value: lead.value,
    email: lead.email,
    phone: lead.phone,
    observations: lead.observations,
    lastContactDate: lead.lastContactDate ? new Date(lead.lastContactDate) : null,
    nextContactDate: lead.nextContactDate ? new Date(lead.nextContactDate) : null,
});

export function LeadCard({ lead, onUpdate, onDelete }: LeadCardProps) {
    // Use useRef para a referência do drag
    const dragRef = useRef<HTMLDivElement>(null);
    const [{ isDragging }, dragConnect] = useDrag({
        type: 'LEAD',
        item: { id: lead.id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Conecta a ref do drag
    dragConnect(dragRef);

    const handleDelete = () => {
        if (onDelete) {
            onDelete(lead.id);
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <div
                    ref={dragRef}
                    style={{ opacity: isDragging ? 0.5 : 1 }}
                    className="cursor-grab active:cursor-grabbing mb-3"
                >
                    <LeadFormDialog
                        trigger={
                            <Card className="hover:bg-muted/50 transition-colors">
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base font-medium">
                                        {lead.companyName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                        {lead.contactName}
                                    </div>
                                    {lead.phone && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <PhoneIcon className="h-3 w-3" />
                                            {formatPhone(lead.phone)}
                                        </div>
                                    )}
                                    {lead.value > 0 && (
                                        <div className="text-sm font-medium">
                                            R$ {numberToCurrency(lead.value)}
                                        </div>
                                    )}
                                    {lead.nextContactDate && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>
                                                {new Date(lead.nextContactDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        }
                        defaultValues={convertToFormData(lead)}
                        onSubmit={(data) => {
                            onUpdate(lead.id, data);
                        }}
                    />
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={handleDelete}
                    className="flex items-center gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    <span>Deletar</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}