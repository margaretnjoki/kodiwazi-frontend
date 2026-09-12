export interface RegisterContributorRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface ContributorResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    enabled: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}