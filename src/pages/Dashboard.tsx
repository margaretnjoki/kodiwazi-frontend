import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { AreaResponse, RentSubmissionResponse, HouseType } from "@/types/rent";
import { HOUSE_TYPE_OPTIONS } from "@/types/rent";

function houseTypeLabel(houseType: HouseType) {
    return HOUSE_TYPE_OPTIONS.find((h) => h.value === houseType)?.label ?? houseType;
}

function statusBadgeClass(status: string) {
    if (status === "FLAGGED") {
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-green-50 text-green-700 border-green-200";
}

export default function Dashboard() {
    const { token } = useAuth();

    const [submissions, setSubmissions] = useState<RentSubmissionResponse[]>([]);
    const [areas, setAreas] = useState<AreaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const [mySubmissions, allAreas] = await Promise.all([
                    apiRequest<RentSubmissionResponse[]>("/rent-submissions/mine", { token }),
                    apiRequest<AreaResponse[]>("/areas"),
                ]);
                setSubmissions(mySubmissions);
                setAreas(allAreas);
            } catch (err) {
                setError(
                    err instanceof ApiError ? err.message : "Couldn't load your submissions."
                );
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [token]);

    const areaName = (areaId: string) =>
        areas.find((a) => a.id === areaId)?.name ?? "Unknown area";

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading your submissions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-slate-900">My Rent Reports</h1>
                <Button asChild size="sm">
                    <Link to="/submit-rent">+ New Report</Link>
                </Button>
            </div>

            {submissions.length === 0 ? (
                <p className="text-slate-600">
                    You haven't submitted any rent reports yet.{" "}
                    <Link to="/submit-rent" className="underline">
                        Submit your first one
                    </Link>
                    .
                </p>
            ) : (
                <div className="flex flex-col gap-3">
                    {submissions.map((s) => (
                        <div
                            key={s.id}
                            className="border rounded-lg p-4 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium text-slate-900">
                                    {areaName(s.areaId)} — {houseTypeLabel(s.houseType)}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                    KSh {s.amount.toLocaleString()} / month
                                    {s.utilitiesIncluded ? " (utilities included)" : " (utilities excluded)"}
                                </p>
                            </div>
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded border ${statusBadgeClass(s.status)}`}
                            >
                {s.status}
              </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}