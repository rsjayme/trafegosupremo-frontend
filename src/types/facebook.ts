export interface FacebookAuthResponse {
    accessToken: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
    graphDomain?: string;
    data_access_expiration_time?: number;
    reauthorize_required_in?: number;
}

export interface FacebookLoginResponse {
    authResponse: FacebookAuthResponse | null;
    status: "connected" | "not_authorized" | "unknown";
}

export interface FacebookAdAccount {
    id: string;
    name: string;
    account_id: string;
    account_status: number;
    currency: string;
    timezone_name: string;
}

export interface FacebookApiError {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
}

export interface FacebookApiResponse<T = unknown> {
    data?: T;
    error?: FacebookApiError;
}

export interface FacebookLoginParams {
    scope: string;
    return_scopes?: boolean;
}

export interface FacebookSDK {
    init(params: {
        appId: string;
        version: string;
        cookie: boolean;
        xfbml: boolean;
    }): void;

    login(
        callback: (response: FacebookLoginResponse) => void,
        params: FacebookLoginParams
    ): void;

    api<T>(
        path: string,
        callback: (response: FacebookApiResponse<T>) => void
    ): void;

    getLoginStatus(
        callback: (response: FacebookLoginResponse) => void
    ): void;

    Event: {
        subscribe(event: string, callback: (response: unknown) => void): void;
        unsubscribe(event: string, callback: (response: unknown) => void): void;
    };

    XFBML: {
        parse(): void;
    };
}