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

export const isApiError = (error: unknown): error is ApiErrorResponse => {
    return typeof error === 'object' &&
        error !== null &&
        'isAxiosError' in error &&
        Boolean(error.isAxiosError);
};