export interface BudgetAlert {
    id: number;
    brandId: number;
    threshold: number;
    startDate: string;
    webhookUrl: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface CreateBudgetAlertDTO {
    brandId: number;
    threshold: number;
    startDate: string;
    webhookUrl: string;
}

export interface UpdateBudgetAlertDTO {
    threshold?: number;
    webhookUrl?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    startDate?: string;
}