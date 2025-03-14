import api from "@/lib/api";

export interface Client {
    id: number
    status: 'ATIVO' | 'INATIVO'
    responsibleName: string
    companyName: string
    value: number | null
    email: string | null
    phone: string | null
    observations: string | null
    createdAt: string
    updatedAt: string
    organizationId: number
}

export interface CreateClientDto {
    status: 'ATIVO' | 'INATIVO'
    responsibleName: string
    companyName: string
    value?: number | null
    email?: string | null
    phone?: string | null
    observations?: string | null
    organizationId?: number // Fornecido automaticamente pelo backend
}

export type UpdateClientDto = Partial<Omit<CreateClientDto, 'organizationId'>>

export interface FilterClientsParams {
    status?: ('ATIVO' | 'INATIVO')[]
    search?: string
    page?: number
    limit?: number
    orderBy?: string
    order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    data: T[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}
type PaginatedClientResponse = PaginatedResponse<Client>

export const clientsService = {
    async list(params: FilterClientsParams): Promise<PaginatedResponse<Client>> {
        const { data } = await api.get<PaginatedClientResponse>('/clients', { params })
        return data
    },

    async getById(id: number): Promise<Client> {
        const { data } = await api.get<Client>(`/clients/${id}`)
        return data
    },

    async create(createData: CreateClientDto): Promise<Client> {
        const { data } = await api.post<Client>('/clients', createData)
        return data
    },

    async update(id: number, updateData: UpdateClientDto): Promise<Client> {
        const { data } = await api.patch<Client>(`/clients/${id}`, updateData)
        return data
    },
}