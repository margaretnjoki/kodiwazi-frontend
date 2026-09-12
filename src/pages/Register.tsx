import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";
import type { RegisterContributorRequest, ContributorResponse } from "@/types/auth";

export default function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await apiRequest<ContributorResponse>("/auth/register", {
                method: "POST",
                body: { firstName, lastName, email, password } satisfies RegisterContributorRequest,
            });
            navigate("/login");
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
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
                <h1 className="text-2xl font-bold text-slate-900 text-center">
                    Create an account
                </h1>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                />
                <input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="border rounded px-3 py-2"
                />
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
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    className="border rounded px-3 py-2"
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </Button>

                <p className="text-sm text-slate-600 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="underline">Log in</Link>
                </p>
            </form>
        </div>
    );
}