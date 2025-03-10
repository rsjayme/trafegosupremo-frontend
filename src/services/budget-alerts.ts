import api from '@/lib/api';
import { BudgetAlert, CreateBudgetAlertDTO, UpdateBudgetAlertDTO } from '@/types/budget-alerts';
import { isApiError } from '@/lib/error';

export const budgetAlertsService = {
    async listByBrand(brandId: number): Promise<BudgetAlert[]> {
        try {
            const response = await api.get<BudgetAlert[]>(`/budget-alerts/brand/${brandId}`);
            return response.data;
        } catch (error: unknown) {
            console.error('Erro ao listar alertas:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao listar alertas de orçamento. Tente novamente.');
        }
    },

    async create(data: CreateBudgetAlertDTO): Promise<BudgetAlert> {
        try {
            const response = await api.post<BudgetAlert>('/budget-alerts', data);
            return response.data;
        } catch (error: unknown) {
            console.error('Erro ao criar alerta:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao criar alerta de orçamento. Tente novamente.');
        }
    },

    async update(id: number, data: UpdateBudgetAlertDTO): Promise<BudgetAlert> {
        try {
            const response = await api.put<BudgetAlert>(`/budget-alerts/${id}`, data);
            return response.data;
        } catch (error: unknown) {
            console.error('Erro ao atualizar alerta:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao atualizar alerta de orçamento. Tente novamente.');
        }
    },

    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/budget-alerts/${id}`);
        } catch (error: unknown) {
            console.error('Erro ao deletar alerta:', error);
            if (isApiError(error) && error.response?.data) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erro ao deletar alerta de orçamento. Tente novamente.');
        }
    },
};