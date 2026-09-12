import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await apiRequest<LoginResponse>("/auth/login", {
                method: "POST",
                body: { email, password } satisfies LoginRequest,
            });
            login(response.token);
            navigate("/");
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.status === 401 ? "Incorrect email or password." : err.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-900 text-center">Log in</h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </Button>

                <p className="text-sm text-slate-600 text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="underline">Register</Link>
                </p>
            </form>
        </div>
    );
}