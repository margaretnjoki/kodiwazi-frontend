import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { apiRequest, ApiError, getEstimateUrl } from "@/lib/api";
import type { RentEstimateResponse, HouseType } from "@/types/rent";
import { HOUSE_TYPE_OPTIONS } from "@/types/rent";

interface SearchState {
    areaId: string;
    areaName: string;
    regionName: string;
    houseType: HouseType;
}

function houseTypeLabel(houseType: HouseType) {
    return HOUSE_TYPE_OPTIONS.find((h) => h.value === houseType)?.label ?? houseType;
}

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as SearchState | null;

    const [estimate, setEstimate] = useState<RentEstimateResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!state) {
            setLoading(false);
            return;
        }

        async function loadEstimate() {
            try {
                const data = await apiRequest<RentEstimateResponse>(
                    getEstimateUrl(state.areaId, state.houseType)
                );
                setEstimate(data);
            } catch (err) {
                setError(
                    err instanceof ApiError
                        ? err.message
                        : "Couldn't load rent data. Please try again."
                );
            } finally {
                setLoading(false);
            }
        }
        loadEstimate();
    }, [state]);

    if (!state) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-slate-600">No search selection found.</p>
                <Button onClick={() => navigate("/search")}>Back to Search</Button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading rent estimate...</p>
            </div>
        );
    }

    if (error || !estimate) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-red-600">{error ?? "No data available for this selection."}</p>
                <Button onClick={() => navigate("/search")}>Back to Search</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-16 gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    {estimate.areaName} — {houseTypeLabel(estimate.houseType)}
                </h1>
                <p className="text-slate-600 mt-1">{state.regionName}</p>
            </div>

            <div className="grid gap-6 w-full max-w-2xl md:grid-cols-2">
                <div className="border rounded-lg p-6 text-left">
                    <h2 className="font-semibold text-slate-900 mb-3">Utilities Included</h2>
                    <p className="text-3xl font-bold text-slate-900">
                        KSh {estimate.utilitiesIncluded.medianAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Median reported rent</p>
                    <div className="mt-4 text-sm text-slate-600 space-y-1">
                        <p>Based on {estimate.utilitiesIncluded.sampleSize} reports</p>
                        <p>Confidence: {estimate.utilitiesIncluded.confidenceLabel}</p>
                    </div>
                </div>

                <div className="border rounded-lg p-6 text-left">
                    <h2 className="font-semibold text-slate-900 mb-3">Utilities Excluded</h2>
                    <p className="text-3xl font-bold text-slate-900">
                        KSh {estimate.utilitiesExcluded.medianAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Median reported rent</p>
                    <div className="mt-4 text-sm text-slate-600 space-y-1">
                        <p>Based on {estimate.utilitiesExcluded.sampleSize} reports</p>
                        <p>Confidence: {estimate.utilitiesExcluded.confidenceLabel}</p>
                    </div>
                </div>
            </div>

            <Button variant="outline" onClick={() => navigate("/search")}>
                New Search
            </Button>
        </div>
    );
}