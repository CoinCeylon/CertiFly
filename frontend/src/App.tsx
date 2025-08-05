import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CardiffDashboard from "./pages/CardiffDashboard";
import VerificationPage from "./pages/VerificationPage";
import NotFound from "./pages/NotFound";
import ICBTDashboard from "./ICBTDashboard";
import HowItWorks from "./pages/How-it-works";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cardiff-met" element={<CardiffDashboard />} />
          <Route path="/icbt-campus" element={<ICBTDashboard />} />
          <Route path="/partner-university-b" element={<ICBTDashboard />} />
          <Route path="/partner-university-c" element={<ICBTDashboard />} />
          <Route path="/partner-university-d" element={<ICBTDashboard />} />
          <Route path="/verify" element={<VerificationPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
