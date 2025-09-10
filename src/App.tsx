import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MobileNav } from "@/components/ui/mobile-nav";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Landing from "./pages/Landing";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OtpVerify from "./pages/OtpVerify";
import Permissions from "./pages/Permissions";
import Success from "./pages/Success";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ContributorDashboard from "./pages/ContributorDashboard";
import MapView from "./pages/MapView";
import PlanRoute from "./pages/PlanRoute";
import RouteTracker from "./pages/RouteTracker";
import Alerts from "./pages/Alerts";
import Parking from "./pages/Parking";
import Wallet from "./pages/Wallet";
import RideHistory from "./pages/RideHistory";
import Offers from "./pages/Offers";
import Support from "./pages/Support";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import GarbageTracker from "./pages/GarbageTracker";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const hideMobileNav = [
    "/",
    "/login",
    "/signup",
    "/otp-verify",
    "/splash",
    "/permissions",
    "/success",
    "/admin-login",
    "/admin-dashboard",
    "/contributor-dashboard",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Success />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/permissions" element={<Permissions />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/contributor-dashboard" element={<ContributorDashboard />} />
        <Route path="/dashboard" element={<MapView />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/plan" element={<PlanRoute />} />
        <Route path="/route-tracker" element={<RouteTracker />} />
        <Route path="/garbage-tracker" element={<GarbageTracker />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/parking" element={<Parking />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/history" element={<RideHistory />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideMobileNav && <MobileNav />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;