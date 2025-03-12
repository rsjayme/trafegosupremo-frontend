import type { DateRange } from 'react-day-picker';

// Interface para o Lead vindo da API
export interface APILead {
    id: number;
    status: LeadStatus;
    priority: LeadPriority;
    contactName: string;
    companyName: string;
    value: number;
    email: string;
    phone: string;
    lastContactDate: string;
    nextContactDate: string;
    observations: string;
    createdAt: string;
    updatedAt?: string;
}

// Status possíveis para um Lead
export type LeadStatus = 'LEAD' | 'PROPOSTA_ENVIADA' | 'FECHADO' | 'NAO_FECHADO';

// Prioridades possíveis para um Lead
export type LeadPriority = 'BAIXA' | 'MEDIA' | 'ALTA';

// Interface para o Lead no formulário
export type LeadFormData = Omit<APILead, 'id' | 'createdAt' | 'updatedAt'>;

// Interface para update parcial do Lead
export type LeadUpdate = Partial<LeadFormData>;

// Tipo para campos de data
export type DateField = 'lastContactDate' | 'nextContactDate' | 'createdAt';

// Interface para o filtro de data
export interface LeadsFilter {
    dateField: DateField;
    range: DateRange | undefined;
}

// Interface para o retorno da API do Kanban
export interface KanbanResponse {
    LEAD: APILead[];
    PROPOSTA_ENVIADA: APILead[];
    FECHADO: APILead[];
    NAO_FECHADO: APILead[];
}

// Type helper para garantir que todas as chaves do status estão presentes
export type KanbanData = {
    [K in LeadStatus]: APILead[];
};