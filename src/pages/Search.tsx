import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {apiRequest, ApiError} from "@/lib/api";
import type {AreaResponse, HouseType} from "@/types/rent";
import {HOUSE_TYPE_OPTIONS} from "@/types/rent";

export default function Search() {
    const navigate = useNavigate();

    const [areas, setAreas] = useState<AreaResponse[]>([]);
    const [loadingAreas, setLoadingAreas] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [regionName, setRegionName] = useState<string>("");
    const [areaId, setAreaId] = useState<string>("");
    const [houseType, setHouseType] = useState<HouseType | "">("");

    useEffect(() => {
        async function loadAreas() {
            try {
                const data = await apiRequest<AreaResponse[]>("/areas");
                setAreas(data);
            } catch (err) {
                setLoadError(
                    err instanceof ApiError ? err.message : "Couldn't load areas. Please refresh."
                );
            } finally {
                setLoadingAreas(false);
            }
        }

        loadAreas();
    }, []);

    const regionNames = Array.from(new Set(areas.map((a) => a.regionName))).sort();

    const areasInRegion = areas.filter((a) => a.regionName === regionName);

    const selectedArea = areas.find((a) => a.id === areaId);

    const handleSearch = () => {
        if (!selectedArea || !houseType) return;
        navigate("/results", {
            state: {
                areaId: selectedArea.id,
                areaName: selectedArea.name,
                regionName: selectedArea.regionName,
                houseType,
            },
        });
    };

    if (loadingAreas) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Loading areas...</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-red-600">{loadError}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
            <h1 className="text-3xl font-bold text-slate-900">Find Rent Estimates</h1>
            <p className="text-slate-600 max-w-md">
                Select a region, area, and house type to see reported rent data.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Select
                    value={regionName}
                    onValueChange={(value) => {
                        setRegionName(value);
                        setAreaId("");
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Region"/>
                    </SelectTrigger>
                    <SelectContent>
                        {regionNames.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={areaId} onValueChange={setAreaId} disabled={!regionName}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Area"/>
                    </SelectTrigger>
                    <SelectContent>
                        {areasInRegion.map((a) => (
                            <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={houseType} onValueChange={(v) => setHouseType(v as HouseType)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select House Type"/>
                    </SelectTrigger>
                    <SelectContent>
                        {HOUSE_TYPE_OPTIONS.map((h) => (
                            <SelectItem key={h.value} value={h.value}>{h.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleSearch} disabled={!areaId || !houseType}>
                    Search
                </Button>
            </div>
        </div>
    );
}