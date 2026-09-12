const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export async function apiRequest<TResponse>(
    path: string,
    options: {
        method?: "GET" | "POST" | "PUT" | "DELETE";
        body?: unknown;
        token?: string | null;
    } = {}
): Promise<TResponse> {
    const { method = "GET", body, token } = options;

    const response = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
        let message = "Something went wrong. Please try again.";
        try {
            const errorBody = await response.json();
            message = errorBody.message || message;
        } catch {
        }
        throw new ApiError(message, response.status);
    }

    return response.json();
}