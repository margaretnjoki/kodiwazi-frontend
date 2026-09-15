import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { apiRequest, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type {
    AreaResponse,
    HouseType,
    RentSubmissionRequest,
    RentSubmissionResponse,
} from "@/types/rent";
import { HOUSE_TYPE_OPTIONS } from "@/types/rent";

export default function SubmitRent() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [areas, setAreas] = useState<AreaResponse[]>([]);
    const [loadingAreas, setLoadingAreas] = useState(true);

    const [regionName, setRegionName] = useState<string>("");
    const [areaId, setAreaId] = useState<string>("");
    const [houseType, setHouseType] = useState<HouseType | "">("");
    const [amount, setAmount] = useState<string>("");
    const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function loadAreas() {
            try {
                const data = await apiRequest<AreaResponse[]>("/areas");
                setAreas(data);
            } catch {
                setError("Couldn't load areas. Please refresh.");
            } finally {
                setLoadingAreas(false);
            }
        }
        loadAreas();
    }, []);

    const regionNames = Array.from(new Set(areas.map((a) => a.regionName))).sort();
    const areasInRegion = areas.filter((a) => a.regionName === regionName);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!areaId || !houseType || !amount) return;

        setSubmitting(true);
        try {
            await apiRequest<RentSubmissionResponse>("/rent-submissions", {
                method: "POST",
                token,
                body: {
                    areaId,
                    houseType,
                    amount: Number(amount),
                    utilitiesIncluded,
                } satisfies RentSubmissionRequest,
            });
            setSuccess(true);
            setAmount("");
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingAreas) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-slate-900 text-center">
                    Report Your Rent
                </h1>
                <p className="text-sm text-slate-600 text-center">
                    Help others by sharing what you actually pay.
                </p>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded p-2">
                        Thanks! Your rent report was submitted.
                    </p>
                )}

                <Select
                    value={regionName}
                    onValueChange={(value) => {
                        setRegionName(value);
                        setAreaId("");
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                        {regionNames.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={areaId} onValueChange={setAreaId} disabled={!regionName}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                        {areasInRegion.map((a) => (
                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={houseType} onValueChange={(v) => setHouseType(v as HouseType)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select House Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {HOUSE_TYPE_OPTIONS.map((h) => (
                            <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <input
                    type="number"
                    placeholder="Monthly rent (KSh)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    required
                    className="border rounded px-3 py-2"
                />

                <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                        type="checkbox"
                        checked={utilitiesIncluded}
                        onChange={(e) => setUtilitiesIncluded(e.target.checked)}
                    />
                    Utilities included in this amount
                </label>

                <Button
                    type="submit"
                    disabled={submitting || !areaId || !houseType || !amount}
                >
                    {submitting ? "Submitting..." : "Submit Rent Report"}
                </Button>

                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </form>
        </div>
    );
}