import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import DashboardLayout from "./pages/DashboardLayout";
import QualifiedAccountsPage from "./pages/dashboard/QualifiedAccounts";
import AnalyticsPage from "./pages/dashboard/Analytics";
import SegmentsPage from "./pages/dashboard/Segments";
import PipelineInsightsPage from "./pages/dashboard/PipelineInsights";
import ICPTrainerPage from "./pages/dashboard/ICPTrainer";
import AutomationSchedulerPage from "./pages/dashboard/AutomationScheduler";
import LiveMonitorPage from "./pages/dashboard/LiveMonitor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard/qualified-accounts" replace />} />
              <Route path="qualified-accounts" element={<QualifiedAccountsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="segments" element={<SegmentsPage />} />
              <Route path="pipeline-insights" element={<PipelineInsightsPage />} />
              <Route path="icp-trainer" element={<ICPTrainerPage />} />
              <Route path="automation-scheduler" element={<AutomationSchedulerPage />} />
              <Route path="live-monitor" element={<LiveMonitorPage />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
