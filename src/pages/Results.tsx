import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import type {RentEstimateResponse} from "@/types/rent";

interface SearchState {
    region: string;
    area: string;
    houseType: string;
}

function getDummyEstimate(area: string, houseType: string): RentEstimateResponse {
    return {
        areaId: "dummy-id",
        areaName: area,
        houseType: houseType,
        utilitiesIncluded: {
            medianAmount: 18500,
            sampleSize: 42,
            confidenceScore: 0.81,
            confidenceLabel: "High",
        },
        utilitiesExcluded: {
            medianAmount: 15000,
            sampleSize: 37,
            confidenceScore: 0.74,
            confidenceLabel: "Medium",
        },
    };
}

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as SearchState | null;


    if (!state) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-slate-600">No search selection found.</p>
                <Button onClick={() => navigate("/search")}>Back to Search</Button>
            </div>
        );
    }

    const estimate = getDummyEstimate(state.area, state.houseType);

    return (
        <div className="min-h-screen flex flex-col items-center px-6 py-16 gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    {estimate.areaName} — {estimate.houseType}
                </h1>
                <p className="text-slate-600 mt-1">{state.region}</p>
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