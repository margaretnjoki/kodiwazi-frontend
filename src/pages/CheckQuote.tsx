import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { apiRequest, ApiError, getCheckQuoteUrl } from "@/lib/api";
import type {
    AreaResponse,
    HouseType,
    QuoteCheckRequest,
    QuoteCheckResponse,
} from "@/types/rent";
import { HOUSE_TYPE_OPTIONS } from "@/types/rent";

function verdictStyle(verdict: string) {
    if (verdict.includes("ABOVE")) return "bg-red-50 text-red-700 border-red-200";
    if (verdict.includes("BELOW")) return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-green-50 text-green-700 border-green-200";
}

function verdictLabel(verdict: string) {
    return verdict
        .split("_")
        .map((w) => w[0] + w.slice(1).toLowerCase())
        .join(" ");
}

export default function CheckQuote() {
    const [areas, setAreas] = useState<AreaResponse[]>([]);
    const [loadingAreas, setLoadingAreas] = useState(true);

    const [regionName, setRegionName] = useState<string>("");
    const [areaId, setAreaId] = useState<string>("");
    const [houseType, setHouseType] = useState<HouseType | "">("");
    const [utilitiesIncluded, setUtilitiesIncluded] = useState(false);
    const [quotedAmount, setQuotedAmount] = useState<string>("");

    const [checking, setChecking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<QuoteCheckResponse | null>(null);

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

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setResult(null);

        if (!areaId || !houseType || !quotedAmount) return;

        setChecking(true);
        try {
            const data = await apiRequest<QuoteCheckResponse>(
                getCheckQuoteUrl(areaId, houseType),
                {
                    method: "POST",
                    body: {
                        quotedAmount: Number(quotedAmount),
                        utilitiesIncluded,
                    } satisfies QuoteCheckRequest,
                }
            );
            setResult(data);
        } catch (err) {
            setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        } finally {
            setChecking(false);
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
        <div className="min-h-screen flex flex-col items-center px-6 py-16 gap-8">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">Is Your Quote Fair?</h1>
                <p className="text-slate-600 mt-1 max-w-md">
                    Enter a rent offer to see how it compares to what others actually pay.
                </p>
            </div>

            <form onSubmit={handleCheck} className="w-full max-w-sm flex flex-col gap-4">
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
                        {error}
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
                    placeholder="Quoted rent (KSh)"
                    value={quotedAmount}
                    onChange={(e) => setQuotedAmount(e.target.value)}
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
                    This quote includes utilities
                </label>

                <Button
                    type="submit"
                    disabled={checking || !areaId || !houseType || !quotedAmount}
                >
                    {checking ? "Checking..." : "Check Quote"}
                </Button>
            </form>

            {result && (
                <div className="w-full max-w-sm border rounded-lg p-6 text-center">
          <span
              className={`inline-block text-sm font-medium px-3 py-1 rounded border ${verdictStyle(result.verdict)}`}
          >
            {verdictLabel(result.verdict)}
          </span>

                    <p className="mt-4 text-3xl font-bold text-slate-900">
                        KSh {result.quotedAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Your quote</p>

                    <div className="mt-4 text-sm text-slate-600 space-y-1">
                        <p>Typical rent: KSh {result.medianAmount.toLocaleString()}</p>
                        {result.percentageDifference !== null && (
                            <p>
                                {result.percentageDifference > 0 ? "+" : ""}
                                {result.percentageDifference.toFixed(1)}% vs typical
                            </p>
                        )}
                        <p>Confidence: {result.confidenceLabel}</p>
                    </div>
                </div>
            )}
        </div>
    );
}