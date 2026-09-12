import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const REGIONS = ["Nairobi", "Mombasa", "Kisumu"];
const AREAS: Record<string, string[]> = {
    Nairobi: ["Kilimani", "Westlands", "South B", "Embakasi"],
    Mombasa: ["Nyali", "Bamburi", "Likoni"],
    Kisumu: ["Milimani", "Nyalenda", "Kondele"],
};
const HOUSE_TYPES = ["Bedsitter", "1 Bedroom", "2 Bedroom", "3 Bedroom"];

export default function Search() {
    const [region, setRegion] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [houseType, setHouseType] = useState<string>("");
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate("/results", { state: { region, area, houseType } });
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
            <h1 className="text-3xl font-bold text-slate-900">Find Rent Estimates</h1>
            <p className="text-slate-600 max-w-md">
                Select a region, area, and house type to see reported rent data.
            </p>

            <div className="flex flex-col gap-4 w-full max-w-xs">
                <Select value={region} onValueChange={(value) => { setRegion(value); setArea(""); }}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                        {REGIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={area} onValueChange={setArea} disabled={!region}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Area" />
                    </SelectTrigger>
                    <SelectContent>
                        {(AREAS[region] || []).map((a) => (
                            <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={houseType} onValueChange={setHouseType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select House Type" />
                    </SelectTrigger>
                    <SelectContent>
                        {HOUSE_TYPES.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleSearch} disabled={!region || !area || !houseType}>
                    Search
                </Button>
            </div>
        </div>
    );
}