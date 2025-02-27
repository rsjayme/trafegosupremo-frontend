export interface FacebookAccount {
    id: number;
    accountId: string;
    accessToken: string;
    name: string;
    status: string;
    brandId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Brand {
    id: number;
    name: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    facebookAccount: FacebookAccount | null;
}