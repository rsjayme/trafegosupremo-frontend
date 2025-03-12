import api from '@/lib/api';
import type {
    APILead,
    LeadFormData,
    LeadUpdate,
    KanbanResponse
} from '@/lib/types/lead';

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

const isApiError = (error: unknown): error is ApiErrorResponse => {
    return typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        Boolean(error.isAxiosError);
};

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
            const response = await api.post<APILead>('/leads', data);
            return response.data;
        } catch (error) {
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao criar lead');
        }
    },

    async update(id: number, data: LeadUpdate): Promise<APILead> {
        try {
            const response = await api.patch<APILead>(`/leads/${id}`, data);
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