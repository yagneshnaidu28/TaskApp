// These match EXACTLY what FastAPI returns in UserResponse and Token schemas

export interface User {
    id: number;
    email: string;
    created_at?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface AuthToken {
    access_token: string;
    token_type: string;
}