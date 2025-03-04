export interface Account {
    id: string;
    name: string;
    metrics: {
        impressions: number;
        clicks: number;
        spend: number;
        results: number;
        ctr: number;
        cpc: number;
        cpa: number;
    };
    demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
    };
}

export interface Campaign {
    id: string;
    name: string;
    accountId: string;
    metrics: {
        impressions: number;
        clicks: number;
        spend: number;
        results: number;
        ctr: number;
        cpc: number;
        cpa: number;
    };
    demographics: {
        age: Record<string, number>;
        gender: Record<string, number>;
        location: Record<string, number>;
    };
}

export interface MockData {
    accounts: Account[];
    campaigns: Campaign[];
}

export const mockData: MockData = {
    accounts: [
        {
            id: "1",
            name: "Conta Principal",
            metrics: {
                impressions: 150000,
                clicks: 7500,
                spend: 15000,
                results: 300,
                ctr: 5,
                cpc: 2,
                cpa: 50,
            },
            demographics: {
                age: {
                    "18-24": 15,
                    "25-34": 35,
                    "35-44": 30,
                    "45-54": 15,
                    "55+": 5,
                },
                gender: {
                    "Masculino": 45,
                    "Feminino": 55,
                },
                location: {
                    "São Paulo": 40,
                    "Rio de Janeiro": 25,
                    "Belo Horizonte": 20,
                    "Outros": 15,
                },
            },
        },
        {
            id: "2",
            name: "Conta Secundária",
            metrics: {
                impressions: 80000,
                clicks: 4000,
                spend: 8000,
                results: 160,
                ctr: 5,
                cpc: 2,
                cpa: 50,
            },
            demographics: {
                age: {
                    "18-24": 20,
                    "25-34": 30,
                    "35-44": 25,
                    "45-54": 15,
                    "55+": 10,
                },
                gender: {
                    "Masculino": 60,
                    "Feminino": 40,
                },
                location: {
                    "São Paulo": 35,
                    "Rio de Janeiro": 30,
                    "Belo Horizonte": 20,
                    "Outros": 15,
                },
            },
        },
    ],
    campaigns: [
        {
            id: "1",
            name: "Campanha de Conversão 1",
            accountId: "1",
            metrics: {
                impressions: 75000,
                clicks: 3750,
                spend: 7500,
                results: 150,
                ctr: 5,
                cpc: 2,
                cpa: 50,
            },
            demographics: {
                age: {
                    "18-24": 20,
                    "25-34": 30,
                    "35-44": 25,
                    "45-54": 15,
                    "55+": 10,
                },
                gender: {
                    "Masculino": 48,
                    "Feminino": 52,
                },
                location: {
                    "São Paulo": 40,
                    "Rio de Janeiro": 25,
                    "Belo Horizonte": 20,
                    "Outros": 15,
                },
            },
        },
        {
            id: "2",
            name: "Campanha de Tráfego 1",
            accountId: "1",
            metrics: {
                impressions: 75000,
                clicks: 3750,
                spend: 7500,
                results: 150,
                ctr: 5,
                cpc: 2,
                cpa: 50,
            },
            demographics: {
                age: {
                    "18-24": 15,
                    "25-34": 35,
                    "35-44": 30,
                    "45-54": 15,
                    "55+": 5,
                },
                gender: {
                    "Masculino": 42,
                    "Feminino": 58,
                },
                location: {
                    "São Paulo": 45,
                    "Rio de Janeiro": 25,
                    "Belo Horizonte": 15,
                    "Outros": 15,
                },
            },
        },
    ],
};