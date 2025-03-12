'use client';

import { Plus } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { LeadsKanban } from '@/components/gestao/leads/LeadsKanban';
import { LeadFormDialog } from '@/components/gestao/leads/LeadFormDialog';
import { useLeads } from '@/hooks/useLeads';

export default function LeadsPage() {
    const { createLead } = useLeads();

    return (
        <div className="h-full flex flex-col">
            <div className="h-14 border-b flex items-center justify-between px-4">
                <h1 className="font-medium">Gestão de Leads</h1>
                <LeadFormDialog
                    trigger={
                        <Button size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Lead
                        </Button>
                    }
                    onSubmit={createLead}
                />
            </div>
            <div className="flex-1 overflow-x-auto">
                <LeadsKanban />
            </div>
        </div>
    );
}