import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Search from "@/pages/Search";
import Results from "@/pages/Results";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/search" element={<Search />} />
                <Route path="/results" element={<Results />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;