import { z } from 'zod';

const leadSchema = z.object({
    id: z.number().optional(), // Opcional para criação, obrigatório para edição
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
    lastContactDate: z.string().default(''),
    nextContactDate: z.string().default(''),
    observations: z.string().default(''),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
});

export type LeadFormData = z.infer<typeof leadSchema>;

export type LeadStatus = LeadFormData['status'];
export type LeadPriority = LeadFormData['priority'];

export { leadSchema };