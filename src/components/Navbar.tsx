import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="w-full border-b px-6 py-4 flex items-center justify-between">
            <Link to="/" className="font-bold text-lg text-slate-900">
                Kodiwazi
            </Link>

            <div className="flex items-center gap-3">
                <Link to="/search" className="text-sm text-slate-600 hover:text-slate-900">
                    Search
                </Link>

                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
                            Dashboard
                        </Link>
                        <Link to="/submit-rent" className="text-sm text-slate-600 hover:text-slate-900">
                            Submit Rent
                        </Link>
                        <Link to="/check-quote" className="text-sm text-slate-600 hover:text-slate-900">
                            Check a Quote
                        </Link>
                        <Button variant="outline" size="sm" onClick={handleLogout}>
                            Log out
                        </Button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">
                            Log in
                        </Link>
                        <Button size="sm" onClick={() => navigate("/register")}>
                            Register
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}