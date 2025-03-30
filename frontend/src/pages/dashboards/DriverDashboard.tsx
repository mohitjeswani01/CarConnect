import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import SOSButton from "@/components/sos-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Car, ChevronRight, Star, CreditCard } from "lucide-react";

// Import driver components
import DriverAvailabilityStatus from "@/components/dashboard/driver/DriverAvailabilityStatus";
import NewRequestsTab from "@/components/dashboard/driver/NewRequestsTab";
import ActiveRidesTab from "@/components/dashboard/driver/ActiveRidesTab";
import RideHistoryTab from "@/components/dashboard/driver/RideHistoryTab";
import DriverProfileForm from "@/components/dashboard/driver/DriverProfileForm";
import DriverNotification from "@/components/notifications/DriverNotification";

// Import interfaces and API
import { driverAPI } from "@/services/api";
import {
  RideRequest,
  ActiveRide,
  PastRide,
  defaultStats,
} from "@/components/dashboard/driver/driverData";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

// Notification interface
interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  details?: any;
}

const DriverDashboard = () => {
  // State for user data and availability
  const [userData, setUserData] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [activeRides, setActiveRides] = useState<ActiveRide[]>([]);
  const [pastRides, setPastRides] = useState<PastRide[]>([]);
  const [stats, setStats] = useState(defaultStats);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const navigate = useNavigate();

  // Error handler utility
  const handleApiError = (error: any, message: string) => {
    console.error(message, error);
    const errorMsg = error.response?.data?.message || "Something went wrong";
    toast.error(message, { description: errorMsg });
  };

  // Play notification sound for new requests
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play();
    } catch (error) {
      console.error("Could not play notification sound:", error);
    }
  };

  // Fetch driver data from API
  const fetchDriverData = useCallback(async () => {
    setIsLoading(true);
    try {
      // First check if driver has a profile
      const profileResponse = await driverAPI.getDriverProfile();
      console.log("Profile response:", profileResponse.data);

      if (profileResponse.data.success) {
        setHasProfile(true);
        setIsAvailable(profileResponse.data.data.isAvailable || false);

        // Fetch all data in parallel for better performance
        const [
          requestsResponse,
          activeResponse,
          historyResponse,
          notificationsResponse,
        ] = await Promise.all([
          driverAPI.getRideRequests(),
          driverAPI.getActiveRides(),
          driverAPI.getRideHistory(),
          driverAPI.getNotifications(),
        ]);

        console.log("Ride Requests:", requestsResponse.data);
        console.log("Active Rides:", activeResponse.data);
        console.log("Ride History:", historyResponse.data);

        // Map API responses to our frontend data models
        // Ride Requests
        const mappedRequests: RideRequest[] = requestsResponse.data.data.map(
          (req: any) => ({
            id: req._id,
            bookingId: req._id,
            carModel: `${req.car?.make || ""} ${req.car?.model || ""}`,
            renterName: req.renter?.name || "Unknown",
            renterPhone: req.renter?.phone || "N/A",
            pickupLocation: req.car?.location || "Not specified",
            dropoffLocation: "As per booking",
            startDate: new Date(req.startDate).toLocaleDateString(),
            endDate: new Date(req.endDate).toLocaleDateString(),
            estimatedEarnings: req.totalPrice || 0,
          })
        );

        // Check if there are new requests
        if (mappedRequests.length > rideRequests.length) {
          setHasNewRequests(true);
          // Play sound if there are new requests
          playNotificationSound();
        }

        setRideRequests(mappedRequests);

        // Active Rides
        const mappedActive: ActiveRide[] = activeResponse.data.data.map(
          (ride: any) => ({
            id: ride._id,
            bookingId: ride._id,
            carModel: `${ride.car?.make || ""} ${ride.car?.model || ""}`,
            renterName: ride.renter?.name || "Unknown",
            renterPhone: ride.renter?.phone || "N/A",
            pickupLocation: ride.car?.location || "Not specified",
            dropoffLocation: "As per booking",
            startDate: new Date(ride.startDate).toLocaleDateString(),
            endDate: new Date(ride.endDate).toLocaleDateString(),
            status: ride.status,
            earnings: ride.totalPrice || 0,
          })
        );

        setActiveRides(mappedActive);

        // Past Rides
        const mappedHistory: PastRide[] = historyResponse.data.data.map(
          (ride: any) => ({
            id: ride._id,
            bookingId: ride._id,
            carModel: `${ride.car?.make || ""} ${ride.car?.model || ""}`,
            renterName: ride.renter?.name || "Unknown",
            date: new Date(ride.endDate).toLocaleDateString(),
            earnings: ride.totalPrice || 0,
            rating: ride.driverRating || 0,
            location: ride.car?.location || "Not specified",
            endLocation: "As per booking",
            duration: `${Math.ceil(
              (new Date(ride.endDate).getTime() -
                new Date(ride.startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )} days`,
          })
        );

        setPastRides(mappedHistory);

        // Calculate stats
        let totalEarnings = 0;
        let totalRidesCount = mappedHistory.length;
        let totalRating = 0;
        let ratedRidesCount = 0;

        mappedHistory.forEach((ride) => {
          totalEarnings += ride.earnings;
          if (ride.rating) {
            totalRating += ride.rating;
            ratedRidesCount++;
          }
        });

        setStats({
          totalEarnings,
          totalRides: totalRidesCount,
          averageRating:
            ratedRidesCount > 0
              ? +(totalRating / ratedRidesCount).toFixed(1)
              : 0,
        });

        // Process notifications
        if (notificationsResponse.data.success) {
          const notifications = notificationsResponse.data.data;
          setNotifications(notifications);
          setHasUnreadNotifications(notifications.some((n: any) => !n.read));
        }
      } else {
        setHasProfile(false);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setHasProfile(false);
      } else {
        handleApiError(error, "Failed to fetch driver data");

        // Use default data if API fails
        setRideRequests([]);
        setActiveRides([]);
        setPastRides([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [rideRequests.length]);

  // Handle toggle availability
  const handleToggleAvailability = async (checked: boolean) => {
    try {
      await driverAPI.toggleAvailability(checked);
      setIsAvailable(checked);
      toast.success(
        `You are now ${checked ? "available" : "unavailable"} for rides`
      );
      fetchDriverData();
    } catch (error) {
      handleApiError(error, "Failed to update availability");
      // Revert the UI state if API fails
      setIsAvailable(!checked);
    }
  };

  // Handle accept ride request
  const handleAcceptRide = async (requestId: string) => {
    try {
      await driverAPI.acceptRide(requestId);
      toast.success("Ride request accepted");
      fetchDriverData();
    } catch (error) {
      handleApiError(error, "Failed to accept ride");
    }
  };

  // Handle reject ride request
  const handleRejectRide = async (requestId: string) => {
    try {
      await driverAPI.rejectRide(requestId);
      toast.info("Ride request rejected");
      fetchDriverData();
    } catch (error) {
      handleApiError(error, "Failed to reject ride");
    }
  };

  // Handle end ride
  const handleEndRide = async (rideId: string) => {
    try {
      await driverAPI.endRide(rideId);
      toast.success("Ride completed successfully");
      fetchDriverData();
    } catch (error) {
      handleApiError(error, "Failed to complete ride");
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Initialize and check auth
  useEffect(() => {
    // Check if user is authenticated and is a driver
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);

      // Debug the userData
      console.log("UserData from localStorage:", userData);

      // Check if user is a driver (handle different data structures)
      const isDriver =
        userData.type === "driver" ||
        (userData.type === "carRental" && userData.role === "driver") ||
        userData.userType === "driver" ||
        userData.user?.role === "driver";

      if (!isDriver) {
        console.error("Not a driver account:", userData);
        toast.error("This account is not registered as a driver");
        navigate("/login");
        return;
      }

      setUserData(userData);
      fetchDriverData();

      // Set up polling for updates if driver is available
      const interval = setInterval(() => {
        if (isAvailable) {
          fetchDriverData();
        }
      }, 30000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error parsing userData:", error);
      toast.error("Session error. Please login again.");
      navigate("/login");
    }
  }, [navigate, fetchDriverData, isAvailable]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <Navbar onLogout={handleLogout}>
        {userData && <DriverNotification userId={userData.id} />}
      </Navbar>
      <div className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {!hasProfile ? (
              <DriverProfileForm
                onComplete={() => {
                  setHasProfile(true);
                  fetchDriverData();
                }}
              />
            ) : isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">Driver Dashboard</h1>
                    <p className="text-muted-foreground">
                      Manage your ride requests and bookings
                    </p>
                  </div>

                  <DriverAvailabilityStatus
                    isAvailable={isAvailable}
                    setIsAvailable={handleToggleAvailability}
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Total Earnings</h3>
                    </div>
                    <p className="text-3xl font-bold">₹{stats.totalEarnings}</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Total Rides</h3>
                    </div>
                    <p className="text-3xl font-bold">{stats.totalRides}</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-medium">Average Rating</h3>
                    </div>
                    <p className="text-3xl font-bold">
                      {stats.averageRating} / 5
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="requests" className="w-full">
                  <TabsList className="mb-8">
                    <TabsTrigger value="requests" className="relative">
                      New Requests
                      {hasNewRequests && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="active">Active Rides</TabsTrigger>
                    <TabsTrigger value="history">Ride History</TabsTrigger>
                  </TabsList>

                  <TabsContent value="requests">
                    <NewRequestsTab
                      rideRequests={rideRequests}
                      onAccept={handleAcceptRide}
                      onReject={handleRejectRide}
                    />
                  </TabsContent>

                  <TabsContent value="active">
                    <ActiveRidesTab
                      activeRides={activeRides}
                      onComplete={handleEndRide}
                    />
                  </TabsContent>

                  <TabsContent value="history">
                    <RideHistoryTab pastRides={pastRides} />
                  </TabsContent>
                </Tabs>
              </div>
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
