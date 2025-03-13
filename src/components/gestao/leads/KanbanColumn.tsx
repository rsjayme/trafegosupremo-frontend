import { useDrop } from 'react-dnd';
import { useRef } from 'react';
import { LeadCard } from './LeadCard';
import type { APILead, LeadFormData } from '@/lib/types/lead';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
    title: string;
    status: APILead['status'];
    leads: APILead[];
    onDrop: (leadId: number, newStatus: APILead['status']) => void;
    onUpdate: (id: number, data: Partial<LeadFormData>) => void;
    onDelete: (id: number) => void;
}

export function KanbanColumn({
    title,
    status,
    leads,
    onDrop,
    onUpdate,
    onDelete
}: KanbanColumnProps) {
    const dropRef = useRef<HTMLDivElement>(null);
    const [{ isOver }, dropConnect] = useDrop({
        accept: 'LEAD',
        drop: (item: { id: number }) => onDrop(item.id, status),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    // Conecta a ref do drop
    dropConnect(dropRef);

    const handleUpdate = (id: number, data: Partial<LeadFormData>) => {
        // Os dados já vêm no formato LeadFormData do LeadCard
        onUpdate(id, data);
    };

    return (
        <div className="flex-1 min-w-[300px] max-w-[350px]">
            <h3 className="font-medium mb-3">{title}</h3>
            <div
                ref={dropRef}
                className={`h-[calc(100vh-13rem)] rounded-lg border bg-muted/30 ${isOver ? 'border-primary' : ''
                    }`}
            >
                <ScrollArea className="h-full p-2">
                    {leads.map((lead) => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onUpdate={handleUpdate}
                            onDelete={onDelete}
                        />
                    ))}
                </ScrollArea>
            </div>
        </div>
    );
}