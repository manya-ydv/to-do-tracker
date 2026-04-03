import { BrowserRouter, Route, Routes } from "react-router-dom";
import SiteNav from "./components/SiteNav";
import { PlannerProvider } from "./context/PlannerContext";
import HomePage from "./pages/HomePage";
import InsightsPage from "./pages/InsightsPage";

function routerBasename() {
  const base = import.meta.env.BASE_URL;
  if (base === "/") return undefined;
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <PlannerProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100">
          <SiteNav />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </div>
      </PlannerProvider>
    </BrowserRouter>
  );
}

