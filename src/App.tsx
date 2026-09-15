import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Search from "@/pages/Search";
import Results from "@/pages/Results";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import SubmitRent from "@/pages/SubmitRent";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/submit-rent"
                        element={
                            <ProtectedRoute>
                                <SubmitRent />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;