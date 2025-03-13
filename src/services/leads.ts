import api from '@/lib/api';
import type { LeadFormData, APILead } from '@/lib/types/lead';

interface ApiError {
    message: string;
    statusCode: number;
}

interface ApiErrorResponse {
    isAxiosError: boolean;
    response?: {
        data: ApiError;
        status: number;
    };
}

interface KanbanResponse {
    LEAD: APILead[];
    PROPOSTA_ENVIADA: APILead[];
    FECHADO: APILead[];
    NAO_FECHADO: APILead[];
}

const isApiError = (error: unknown): error is ApiErrorResponse => {
    return typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        Boolean(error.isAxiosError);
};

const convertFormDataToApi = (data: LeadFormData | Partial<LeadFormData>): Partial<APILead> => ({
    ...data,
    lastContactDate: data.lastContactDate?.toISOString() ?? null,
    nextContactDate: data.nextContactDate?.toISOString() ?? null,
});

export const leadsService = {
    async getKanban(): Promise<KanbanResponse> {
        try {
            const response = await api.get<KanbanResponse>('/leads/kanban');
            return response.data;
        } catch (error) {
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao carregar leads');
        }
    },

    async create(data: LeadFormData): Promise<APILead> {
        try {
            const apiData = convertFormDataToApi(data);
            const response = await api.post<APILead>('/leads', apiData);
            return response.data;
        } catch (error) {
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao criar lead');
        }
    },

    async update(id: number, data: Partial<LeadFormData>): Promise<APILead> {
        try {
            const apiData = convertFormDataToApi(data);
            const response = await api.patch<APILead>(`/leads/${id}`, apiData);
            return response.data;
        } catch (error) {
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao atualizar lead');
        }
    },

    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/leads/${id}`);
        } catch (error) {
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao deletar lead');
        }
    }
};