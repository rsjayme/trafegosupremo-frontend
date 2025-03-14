import { z } from 'zod';

const clientSchema = z.object({
    status: z.enum(['ATIVO', 'INATIVO']),
    responsibleName: z.string().min(1, 'Nome do responsável é obrigatório'),
    companyName: z.string().min(1, 'Nome da empresa é obrigatório'),
    value: z.string(),
    email: z.string(),
    phone: z.string(),
    observations: z.string(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

// Tipo para os dados do cliente com ID e timestamps
export type ClientData = {
    id: number;
    status: 'ATIVO' | 'INATIVO';
    responsibleName: string;
    companyName: string;
    value: number | null;
    email: string | null;
    phone: string | null;
    observations: string | null;
    createdAt: string;
    updatedAt: string;
};

// Função para converter dados do formulário para o formato da API
export function formatFormDataToApi(formData: ClientFormData): Omit<ClientData, 'id' | 'createdAt' | 'updatedAt'> {
    return {
        status: formData.status,
        responsibleName: formData.responsibleName,
        companyName: formData.companyName,
        value: formData.value ? Number(formData.value.replace(/\D/g, '')) / 100 : null,
        email: formData.email || null,
        phone: formData.phone || null,
        observations: formData.observations || null,
    };
}

// Função para converter dados da API para o formato do formulário
export function formatApiDataToForm(apiData: ClientData): ClientFormData {
    return {
        status: apiData.status,
        responsibleName: apiData.responsibleName,
        companyName: apiData.companyName,
        value: apiData.value?.toString() || '',
        email: apiData.email || '',
        phone: apiData.phone || '',
        observations: apiData.observations || '',
    };
}

export { clientSchema };