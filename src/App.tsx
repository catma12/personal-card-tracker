import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CardProvider } from "@/context/CardContext";
import { SpendingGoalProvider } from "@/context/SpendingGoalContext";
import { Layout } from "@/components/Layout";
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import MyCards from "./pages/MyCards";
import Credits from "./pages/Credits";
import Chase524 from "./pages/Chase524";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import EligibilityPage from "./pages/EligibilityPage";
import TransferPartners from "./pages/TransferPartners";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CardProvider>
          <SpendingGoalProvider>
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/cards" element={<MyCards />} />
                  <Route path="/credits" element={<Credits />} />
                  <Route path="/524" element={<Chase524 />} />
                  <Route path="/eligibility" element={<EligibilityPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/transfer-partners" element={<TransferPartners />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </SpendingGoalProvider>
        </CardProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
