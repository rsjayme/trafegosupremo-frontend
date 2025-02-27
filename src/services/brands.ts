import api from "@/lib/api";
import { Brand } from "@/types/brand";

export const brandsService = {
    async listBrands(): Promise<Brand[]> {
        const response = await api.get<Brand[]>("/brands");
        return response.data;
    },

    async createBrand(name: string): Promise<Brand> {
        const response = await api.post<Brand>("/brands", { name });
        return response.data;
    },

    async getBrand(id: number): Promise<Brand> {
        const response = await api.get<Brand>(`/brands/${id}`);
        return response.data;
    },

    async updateBrand(id: number, name: string): Promise<Brand> {
        const response = await api.patch<Brand>(`/brands/${id}`, { name });
        return response.data;
    },

    async connectFacebook(brandId: number, accessToken: string, accountId: string): Promise<Brand> {
        const response = await api.post<Brand>("/facebook/accounts", {
            brandId,
            accessToken,
            accountId
        });
        return response.data;
    }
};