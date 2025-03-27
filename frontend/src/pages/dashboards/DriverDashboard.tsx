import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import SOSButton from "@/components/sos-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Driver Dashboard Components
import DriverAvailabilityStatus from "@/components/dashboard/driver/DriverAvailabilityStatus";
import NewRequestsTab from "@/components/dashboard/driver/NewRequestsTab";
import ActiveRidesTab from "@/components/dashboard/driver/ActiveRidesTab";
import RideHistoryTab from "@/components/dashboard/driver/RideHistoryTab";

// API
import { driverAPI } from "@/services/api";
import { RideRequest, ActiveRide, PastRide } from "@/components/dashboard/driver/driverData";

const DriverDashboard = () => {
    const [isAvailable, setIsAvailable] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
    const [activeRides, setActiveRides] = useState<ActiveRide[]>([]);
    const [pastRides, setPastRides] = useState<PastRide[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated and is a driver
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            toast.error("Please login to access this page");
            navigate("/login");
            return;
        }

        const userData = JSON.parse(userDataStr);
        if (!userData.isLoggedIn || userData.type !== "carRental" || userData.role !== "driver") {
            toast.error("Unauthorized access");
            navigate("/login");
            return;
        }

        setUserData(userData);

        // Load data from the API
        fetchDriverData();
    }, [navigate]);

    const fetchDriverData = async () => {
        setIsLoading(true);
        try {
            // Fetch data in parallel
            const [requestsResponse, activeResponse, historyResponse] = await Promise.all([
                driverAPI.getRideRequests(),
                driverAPI.getActiveRides(),
                driverAPI.getRideHistory()
            ]);

            console.log("Ride Requests:", requestsResponse.data);
            console.log("Active Rides:", activeResponse.data);
            console.log("Ride History:", historyResponse.data);

            // Ensure the data is an array
            if (Array.isArray(requestsResponse.data)) {
                setRideRequests(requestsResponse.data);
            } else {
                throw new Error("Invalid data format for ride requests");
            }

            if (Array.isArray(activeResponse.data)) {
                setActiveRides(activeResponse.data);
            } else {
                throw new Error("Invalid data format for active rides");
            }

            if (Array.isArray(historyResponse.data)) {
                setPastRides(historyResponse.data);
            } else {
                throw new Error("Invalid data format for ride history");
            }
        } catch (error) {
            console.error("Error fetching driver data:", error);
            toast.error("Failed to load driver data", {
                description: "Please check your connection and try again."
            });

            // Fallback to sample data if API fails
            import("@/components/dashboard/driver/driverData").then(data => {
                setRideRequests(data.rideRequests);
                setActiveRides(data.activeRides);
                setPastRides(data.pastRides);
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvailabilityChange = async (available: boolean) => {
        try {
            await driverAPI.toggleAvailability(available);
            setIsAvailable(available);
            toast.success(`You are now ${available ? 'available' : 'unavailable'} for new ride requests.`);
        } catch (error) {
            console.error("Error updating availability:", error);
            toast.error("Failed to update availability status");
        }
    };

    // Page transition
    const pageVariants = {
        initial: {
            opacity: 0,
        },
        in: {
            opacity: 1,
        },
        out: {
            opacity: 0,
        },
    };

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.5 }}
        >
            <Navbar />
            <div className="pt-24">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">Driver Dashboard</h1>
                                <p className="text-muted-foreground">
                                    Manage your availability and ride requests
                                </p>
                            </div>
                            <DriverAvailabilityStatus
                                isAvailable={isAvailable}
                                setIsAvailable={handleAvailabilityChange}
                            />
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <Tabs defaultValue="requests" className="w-full">
                                <TabsList className="grid grid-cols-3 mb-8">
                                    <TabsTrigger value="requests">New Requests</TabsTrigger>
                                    <TabsTrigger value="active">Active Rides</TabsTrigger>
                                    <TabsTrigger value="history">Ride History</TabsTrigger>
                                </TabsList>

                                <TabsContent value="requests">
                                    <NewRequestsTab rideRequests={rideRequests} />
                                </TabsContent>

                                <TabsContent value="active">
                                    <ActiveRidesTab activeRides={activeRides} />
                                </TabsContent>

                                <TabsContent value="history">
                                    <RideHistoryTab pastRides={pastRides} />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
            <SOSButton />
        </motion.div>
    );
};

export default DriverDashboard;
