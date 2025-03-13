import { z } from 'zod';

const leadSchema = z.object({
    status: z.enum(['LEAD', 'PROPOSTA_ENVIADA', 'FECHADO', 'NAO_FECHADO']).default('LEAD'),
    priority: z.enum(['BAIXA', 'MEDIA', 'ALTA']).default('MEDIA'),
    contactName: z.string({
        required_error: 'Nome do contato é obrigatório'
    }).min(1, 'Nome do contato é obrigatório'),
    companyName: z.string({
        required_error: 'Nome da empresa é obrigatório'
    }).min(1, 'Nome da empresa é obrigatório'),
    value: z.coerce.number().default(0),
    email: z.string().default(''),
    phone: z.string().default(''),
    lastContactDate: z.date().nullable(),
    nextContactDate: z.date().nullable(),
    observations: z.string().default('')
});

// Interface para resposta da API
export interface ApiLead extends z.infer<typeof leadSchema> {
    id: number;
    createdAt: string;
    updatedAt?: string;
}

// Tipo para o formulário
export type LeadFormData = z.infer<typeof leadSchema>;

// Tipo para update parcial
export type LeadUpdateData = Partial<LeadFormData>;

export type LeadStatus = LeadFormData['status'];
export type LeadPriority = LeadFormData['priority'];

export { leadSchema };