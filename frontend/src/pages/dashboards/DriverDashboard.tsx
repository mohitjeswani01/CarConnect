import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import SOSButton from "@/components/sos-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  CarFront,
  MapPin,
  Phone,
  Clock,
  Calendar,
  User,
  AlertCircle,
  Bell,
} from "lucide-react";
import { driverAPI } from "@/services/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DriverNotification from "@/components/notifications/DriverNotification";
import DriverData from "@/components/dashboard/driver/driverData";

// Import interfaces from driverData
import {
  RideRequest,
  ActiveRide,
  PastRide,
} from "@/components/dashboard/driver/driverData";

interface Notification {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  details?: any;
}

const DriverDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [rideRequests, setRideRequests] = useState<RideRequest[]>([]);
  const [activeRides, setActiveRides] = useState<ActiveRide[]>([]);
  const [pastRides, setPastRides] = useState<PastRide[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalRides: 0,
    averageRating: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  const navigate = useNavigate();

  // Fetch driver data from API
  const fetchDriverData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch driver profile to get availability status
      const profileResponse = await driverAPI.getDriverProfile();

      if (profileResponse.data.success) {
        setHasProfile(true);
        setIsAvailable(profileResponse.data.data.isAvailable);

        // Fetch all data in parallel
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

        // Map backend data to frontend interfaces
        const mappedRequests: RideRequest[] = requestsResponse.data.data.map(
          (req: any) => ({
            id: req._id,
            carModel: req.car
              ? `${req.car.make} ${req.car.model}`
              : "Unknown Car",
            renterName: req.renter ? req.renter.name : "Unknown Renter",
            renterPhone: req.renter
              ? req.renter.phone || "Not Provided"
              : "Not Provided",
            pickupLocation:
              req.pickupLocation || req.car?.location || "Not Specified",
            dropoffLocation: req.dropoffLocation || "Not Specified",
            startDate: new Date(req.startDate).toLocaleDateString(),
            endDate: new Date(req.endDate).toLocaleDateString(),
            estimatedEarnings: calculateEstimatedEarnings(
              req.startDate,
              req.endDate
            ),
          })
        );

        const mappedActiveRides: ActiveRide[] = activeResponse.data.data.map(
          (ride: any) => ({
            id: ride._id,
            carModel: ride.car
              ? `${ride.car.make} ${ride.car.model}`
              : "Unknown Car",
            renterName: ride.renter ? ride.renter.name : "Unknown Renter",
            renterPhone: ride.renter
              ? ride.renter.phone || "Not Provided"
              : "Not Provided",
            pickupLocation:
              ride.pickupLocation || ride.car?.location || "Not Specified",
            dropoffLocation: ride.dropoffLocation || "Not Specified",
            startDate: new Date(ride.startDate).toLocaleDateString(),
            endDate: new Date(ride.endDate).toLocaleDateString(),
            status: capitalizeFirstLetter(ride.status),
            earnings:
              ride.driverPay ||
              calculateEstimatedEarnings(ride.startDate, ride.endDate),
          })
        );

        const mappedPastRides: PastRide[] = historyResponse.data.data.map(
          (ride: any) => ({
            id: ride._id,
            carModel: ride.car
              ? `${ride.car.make} ${ride.car.model}`
              : "Unknown Car",
            renterName: ride.renter ? ride.renter.name : "Unknown Renter",
            date: new Date(ride.startDate).toLocaleDateString(),
            earnings:
              ride.driverPay ||
              calculateEstimatedEarnings(ride.startDate, ride.endDate),
            rating: ride.driverRating || 5,
            status: capitalizeFirstLetter(ride.status),
          })
        );

        // Update state with mapped data
        setRideRequests(mappedRequests);
        setActiveRides(mappedActiveRides);
        setPastRides(mappedPastRides);

        // Calculate stats
        calculateStats(mappedPastRides);

        // Check for new requests
        const previousLength = rideRequests.length;
        if (mappedRequests.length > previousLength && previousLength > 0) {
          setHasNewRequests(true);
          playNotificationSound();
          toast.info("New ride request available!", {
            description: "You have a new ride request. Check your dashboard.",
          });
        }

        // Handle notifications
        setNotifications(notificationsResponse.data.data);
        setHasUnreadNotifications(
          notificationsResponse.data.data.some((n: Notification) => !n.read)
        );
      } else {
        setHasProfile(false);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Profile not found, set hasProfile to false
        setHasProfile(false);
        setIsLoading(false);
        return;
      }

      handleApiError(error, "Error fetching driver data");
      toast.error("Failed to load data", {
        description: "Please check your connection and try again.",
      });

      // Fallback to sample data from driverData.ts
      import("@/components/dashboard/driver/driverData").then((data) => {
        setRideRequests(data.rideRequests);
        setActiveRides(data.activeRides);
        setPastRides(data.pastRides);
        calculateStats(data.pastRides);
      });
    } finally {
      setIsLoading(false);
    }
  }, [rideRequests.length]);

  // Helper function to calculate estimated earnings based on date range
  const calculateEstimatedEarnings = (
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(1, days) * 500;
  };

  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Helper function to calculate statistics
  const calculateStats = (rides: PastRide[]): void => {
    const totalEarnings = rides.reduce(
      (sum, ride) => sum + (ride.earnings || 0),
      0
    );
    const totalRides = rides.length;
    const totalRatings = rides.reduce(
      (sum, ride) => sum + (ride.rating || 5),
      0
    );
    const avgRating =
      totalRides > 0 ? +(totalRatings / totalRides).toFixed(1) : 0;

    setStats({
      totalEarnings,
      totalRides,
      averageRating: avgRating,
    });
  };

  // Helper function to handle API errors
  const handleApiError = (error: any, customMessage: string) => {
    console.error(error);

    const errorMessage = error.response?.data?.message || customMessage;
    toast.error(customMessage, {
      description: errorMessage,
    });
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

  // Update the authentication check in the useEffect
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

      // Debug the userData to see what we've got
      console.log("UserData from localStorage:", userData);

      // Extract user ID and token for passing to API requests
      let userId = userData.id || userData.user?.id;

      // Allow for different structures depending on how your login saves data
      const isDriver =
        userData.type === "driver" ||
        (userData.type === "carRental" && userData.role === "driver") ||
        userData.userType === "driver" ||
        userData.user?.role === "driver";

      if (!isDriver) {
        console.error("Not a driver account:", userData);
        toast.error(
          "Unauthorized access - This account is not registered as a driver"
        );
        navigate("/login");
        return;
      }

      setUserData({
        ...userData,
        id: userId, // Ensure ID is available in userData
      });

      // Load data
      fetchDriverData();

      // Poll for new requests every 30 seconds if driver is available
      const interval = setInterval(() => {
        if (isAvailable) {
          fetchDriverData();
        }
      }, 30000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error parsing userData:", error);
      toast.error("Login session corrupted. Please login again.");
      navigate("/login");
    }
  }, [navigate, fetchDriverData, isAvailable]);

  const handleToggleAvailability = async () => {
    try {
      await driverAPI.toggleAvailability(!isAvailable);
      setIsAvailable(!isAvailable);

      toast.success(
        `You are now ${
          !isAvailable ? "available" : "unavailable"
        } for new rides`,
        {
          description: !isAvailable
            ? "You'll start receiving ride requests soon."
            : "You won't receive new ride requests until you toggle back.",
        }
      );
    } catch (error) {
      handleApiError(error, "Error toggling availability");
      toast.error("Failed to update availability");
    }
  };

  const handleAcceptRide = async (requestId: string) => {
    try {
      await driverAPI.acceptRide(requestId);

      // Remove from requests and fetch updated active rides
      setRideRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast.success("Ride accepted successfully", {
        description: "The renter has been notified. Check your active rides.",
      });

      // Refresh data to get updated active rides
      fetchDriverData();

      // Switch to active tab
      document
        .querySelector('[value="activeRides"]')
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } catch (error) {
      handleApiError(error, "Error accepting ride");
      toast.error("Failed to accept ride");
    }
  };

  const handleRejectRide = async (requestId: string) => {
    try {
      await driverAPI.rejectRide(requestId);

      // Remove from requests list
      setRideRequests((prev) => prev.filter((req) => req.id !== requestId));

      toast.success("Ride request rejected", {
        description:
          "The renter will be notified that their car is booked without a driver.",
      });
    } catch (error) {
      handleApiError(error, "Error rejecting ride");
      toast.error("Failed to reject ride");
    }
  };

  const handleCompleteRide = async (rideId: string) => {
    try {
      await driverAPI.endRide(rideId);

      // Refresh all data
      fetchDriverData();

      toast.success("Ride completed successfully", {
        description:
          "The ride has been marked as completed and the renter has been notified.",
      });
    } catch (error) {
      handleApiError(error, "Error completing ride");
      toast.error("Failed to complete ride");
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    try {
      await driverAPI.markNotificationAsRead(notificationId);

      // Update local state
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );

      // Check if there are still unread notifications
      const stillHasUnread = notifications.some(
        (n) => n.id !== notificationId && !n.read
      );
      setHasUnreadNotifications(stillHasUnread);
    } catch (error) {
      handleApiError(error, "Error marking notification as read");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Page transition
  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.5 }}
    >
      <Navbar onLogout={handleLogout}>
        <DriverNotification userId={userData?.id} />
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
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                      Driver Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                      Manage your rides and track your earnings.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="availability"
                        checked={isAvailable}
                        onCheckedChange={handleToggleAvailability}
                      />
                      <Label htmlFor="availability">Available for rides</Label>
                    </div>
                    <Badge variant={isAvailable ? "default" : "secondary"}>
                      {isAvailable ? "Online" : "Offline"}
                    </Badge>
                  </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Earnings
                      </h3>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <span className="text-primary">₹</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      ₹{stats.totalEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Rides
                      </h3>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CarFront size={16} className="text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalRides}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Average Rating
                      </h3>
                      <div className="bg-primary/10 p-2 rounded-full">
                        <span className="text-primary">★</span>
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      {stats.averageRating} / 5
                    </p>
                  </div>
                </div>

                <Tabs defaultValue="rideRequests" className="w-full">
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="rideRequests" className="relative">
                      Ride Requests
                      {hasNewRequests && (
                        <Badge className="ml-2 absolute -top-1 -right-1 h-2 w-2 p-0 rounded-full bg-red-500" />
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="activeRides">Active Rides</TabsTrigger>
                    <TabsTrigger value="pastRides">Past Rides</TabsTrigger>
                  </TabsList>

                  <TabsContent value="rideRequests">
                    <div className="space-y-6">
                      {rideRequests.length > 0 ? (
                        rideRequests.map((request) => (
                          <div
                            key={request.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold mb-1">
                                    {request.carModel}
                                  </h3>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <User size={14} className="mr-1" />
                                    <span>{request.renterName}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Phone size={14} className="mr-1" />
                                    <span>{request.renterPhone}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-lg font-bold text-primary">
                                    ₹{request.estimatedEarnings}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Estimated earnings
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Pickup Location
                                  </p>
                                  <div className="flex items-center">
                                    <MapPin
                                      size={16}
                                      className="mr-2 text-primary"
                                    />
                                    <span>{request.pickupLocation}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Dropoff Location
                                  </p>
                                  <div className="flex items-center">
                                    <MapPin
                                      size={16}
                                      className="mr-2 text-primary"
                                    />
                                    <span>{request.dropoffLocation}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center text-sm text-muted-foreground mb-6">
                                <Calendar size={16} className="mr-2" />
                                <span>
                                  {request.startDate} to {request.endDate}
                                </span>
                              </div>

                              <div className="flex gap-3">
                                <Button
                                  onClick={() => handleAcceptRide(request.id)}
                                  className="flex-1"
                                >
                                  Accept Ride
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleRejectRide(request.id)}
                                  className="flex-1"
                                >
                                  Decline
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                          <AlertCircle
                            size={64}
                            className="mx-auto text-muted-foreground mb-4"
                          />
                          <h3 className="text-xl font-semibold mb-2">
                            No Ride Requests
                          </h3>
                          <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            You don't have any new ride requests at the moment.
                            Make sure you're marked as available to receive
                            requests.
                          </p>
                          {!isAvailable && (
                            <Button onClick={handleToggleAvailability}>
                              Go Online
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="activeRides">
                    <div className="space-y-6">
                      {activeRides.length > 0 ? (
                        activeRides.map((ride) => (
                          <div
                            key={ride.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                          >
                            <div className="p-6">
                              <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div>
                                  <div className="flex items-center mb-1">
                                    <h3 className="text-xl font-semibold mr-2">
                                      {ride.carModel}
                                    </h3>
                                    <Badge>{ride.status}</Badge>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <User size={14} className="mr-1" />
                                    <span>{ride.renterName}</span>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Phone size={14} className="mr-1" />
                                    <span>{ride.renterPhone}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="text-lg font-bold text-primary">
                                    ₹{ride.earnings}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Earnings
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Pickup Location
                                  </p>
                                  <div className="flex items-center">
                                    <MapPin
                                      size={16}
                                      className="mr-2 text-primary"
                                    />
                                    <span>{ride.pickupLocation}</span>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mb-1">
                                    Dropoff Location
                                  </p>
                                  <div className="flex items-center">
                                    <MapPin
                                      size={16}
                                      className="mr-2 text-primary"
                                    />
                                    <span>{ride.dropoffLocation}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center text-sm text-muted-foreground mb-6">
                                <Calendar size={16} className="mr-2" />
                                <span>
                                  {ride.startDate} to {ride.endDate}
                                </span>
                              </div>

                              <Button
                                onClick={() => handleCompleteRide(ride.id)}
                                variant="default"
                                className="w-full"
                              >
                                Complete Ride
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                          <CarFront
                            size={64}
                            className="mx-auto text-muted-foreground mb-4"
                          />
                          <h3 className="text-xl font-semibold mb-2">
                            No Active Rides
                          </h3>
                          <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            You don't have any active rides at the moment. Check
                            the ride requests tab for new opportunities.
                          </p>
                          <Button
                            onClick={() =>
                              document
                                .querySelector('[value="rideRequests"]')
                                ?.dispatchEvent(
                                  new MouseEvent("click", { bubbles: true })
                                )
                            }
                          >
                            Check Ride Requests
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="pastRides">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm">
                              Car Model
                            </th>
                            <th className="px-4 py-3 text-left text-sm">
                              Renter
                            </th>
                            <th className="px-4 py-3 text-left text-sm">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-sm">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm">
                              Earnings
                            </th>
                            <th className="px-4 py-3 text-left text-sm">
                              Rating
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastRides.length > 0 ? (
                            pastRides.map((ride) => (
                              <tr
                                key={ride.id}
                                className="border-b border-muted/30"
                              >
                                <td className="px-4 py-4 text-sm">
                                  {ride.carModel}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  {ride.renterName}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  {ride.date}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <Badge variant="outline">
                                    {ride.status || "Completed"}
                                  </Badge>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium">
                                  ₹{ride.earnings}
                                </td>
                                <td className="px-4 py-4 text-sm">
                                  <div className="flex items-center">
                                    <span className="text-yellow-500 mr-1">
                                      ★
                                    </span>
                                    {(ride.rating || 5).toFixed(1)}
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-4 py-8 text-center">
                                <p className="text-muted-foreground">
                                  No past rides found. Complete your first ride
                                  to see history here.
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
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
