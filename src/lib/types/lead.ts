import type { DateRange } from 'react-day-picker';

// Status e Prioridades
export type LeadStatus = 'LEAD' | 'PROPOSTA_ENVIADA' | 'FECHADO' | 'NAO_FECHADO';
export type LeadPriority = 'BAIXA' | 'MEDIA' | 'ALTA';
export interface DateField {
    createdAt: string;
    lastContactDate: string;
    nextContactDate: string;
}

// Campos base compartilhados
interface BaseLeadFields {
    status: LeadStatus;
    priority: LeadPriority;
    contactName: string;
    companyName: string;
    value: number;
    email: string;
    phone: string;
    observations: string;
}

// Interface para o lead no formulário
export interface LeadFormData extends BaseLeadFields {
    lastContactDate: Date | null;
    nextContactDate: Date | null;
}

// Interface para o lead na API
export interface APILead extends BaseLeadFields {
    id: number;
    lastContactDate: string | null;
    nextContactDate: string | null;
    createdAt: string;
    updatedAt?: string;
}

// Tipo para update parcial
export type LeadUpdate = Partial<LeadFormData>;

// Interface para o filtro de data
export interface LeadsFilter {
    dateField: 'lastContactDate' | 'nextContactDate' | 'createdAt';
    range: DateRange | undefined;
}

// Interface para o retorno da API do Kanban
export interface KanbanResponse {
    LEAD: APILead[];
    PROPOSTA_ENVIADA: APILead[];
    FECHADO: APILead[];
    NAO_FECHADO: APILead[];
}

// Interface para os dados do Kanban após processamento
export type KanbanData = {
    [K in LeadStatus]: APILead[];
};