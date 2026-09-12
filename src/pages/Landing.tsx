import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Kodiwazi
            </h1>
            <p className="mt-3 text-lg md:text-xl text-slate-600 max-w-xl">
                Kenya Rent Transparency — know what people actually pay before you sign a lease.
            </p>

            <div className="mt-8 flex gap-4">
                <Button size="lg" onClick={() => navigate("/search")}>
                    Get Started
                </Button>
                <Button size="lg" variant="outline">
                    Learn More
                </Button>
            </div>

            <p className="mt-16 text-sm text-slate-400">
                Crowdsourced rent data for Nairobi, Mombasa, Kisumu and beyond.
            </p>
        </div>
    );
}