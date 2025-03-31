import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Carpool from "./pages/Carpool";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CarpoolLogin from "./pages/CarpoolLogin";
import CarpoolSignup from "./pages/CarpoolSignup";
import SOS from "./pages/SOS";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import CarOwnerDashboard from "./pages/dashboards/CarOwnerDashboard";
import CarRenterDashboard from "./pages/dashboards/CarRenterDashboard";
import DriverDashboard from "./pages/dashboards/DriverDashboard";
import CarpoolDashboard from "./pages/dashboards/CarpoolDashboard";
import BookingForm from "./pages/BookingForm";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/carpool" element={<Carpool />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/carpool-login" element={<CarpoolLogin />} />
                            <Route path="/carpool-signup" element={<CarpoolSignup />} />
                            <Route path="/sos" element={<SOS />} />
                            <Route
                                path="/booking-form/:carId"
                                element={<BookingForm carId={""} pricePerDay={0} withDriver={false} onSubmit={function (bookingData: { carId: string; numberOfDays: number; totalAmount: number; withDriver: boolean; }): Promise<void> {
                                    throw new Error("Function not implemented.");
                                } } />}
                            />

                            {/* Dashboard Routes */}
                            <Route path="/car-owner-dashboard" element={<CarOwnerDashboard />} />
                            <Route path="/car-renter-dashboard" element={<CarRenterDashboard />} />
                            <Route path="/driver-dashboard" element={<DriverDashboard />} />
                            <Route path="/carpool-dashboard" element={<CarpoolDashboard />} />

                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </AnimatePresence>
                </BrowserRouter>
            </TooltipProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
