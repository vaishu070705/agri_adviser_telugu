import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FarmerProvider } from "@/contexts/FarmerContext";
import { initAlertEngine } from "@/services/alertService";
import Layout from "@/components/Layout";
import Registration from "@/pages/Registration";
import CropRecommendation from "@/pages/CropRecommendation";
import FertilizerAdvisor from "@/pages/FertilizerAdvisor";
import DiseaseDetection from "@/pages/DiseaseDetection";
import PesticideRecommendation from "@/pages/PesticideRecommendation";
import YieldPrediction from "@/pages/YieldPrediction";
import HealthScore from "@/pages/HealthScore";
import FarmEconomics from "@/pages/FarmEconomics";
import ProfitEstimation from "@/pages/ProfitEstimation";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Workers from "@/pages/Workers";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Boot the event-driven alert engine once
initAlertEngine();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <FarmerProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Registration />} />
                <Route path="/crop-recommendation" element={<CropRecommendation />} />
                <Route path="/fertilizer-advisor" element={<FertilizerAdvisor />} />
                <Route path="/disease-detection" element={<DiseaseDetection />} />
                <Route path="/pesticide-recommendation" element={<PesticideRecommendation />} />
                <Route path="/yield-prediction" element={<YieldPrediction />} />
                <Route path="/health-score" element={<HealthScore />} />
                <Route path="/farm-economics" element={<FarmEconomics />} />
                <Route path="/profit-estimation" element={<ProfitEstimation />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/workers" element={<Workers />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </FarmerProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
