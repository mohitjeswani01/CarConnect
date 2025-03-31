import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import SOSButton from "@/components/sos-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchRideForm from "@/components/carpool/search-ride-form";
import PostRideForm from "@/components/carpool/post-ride-form";
import RideCard from "@/components/carpool/ride-card";
import { toast } from "sonner";
import { Car, MapPin, Users, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:5050/api/carpool";

// Define better types for the ride objects
interface Driver {
  name: string;
  rating: string;
  car?: string;
}

interface Passenger {
  id: string;
  name: string;
  pickupPoint: string;
}

interface PostedRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  availableSeats: number;
  price: number;
  status: string;
  passengers: Passenger[];
}

interface BookedRide {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  price: number;
  status: string;
  driver: Driver;
}

interface CompletedRide {
  id: string;
  from: string;
  to: string;
  date: string;
  type: string;
  price?: number;
  totalEarnings?: number;
  passengers?: number;
  driver?: Driver;
}

export interface RideCardProps {
  ride: any;
  index: number;
  onBookRide: () => Promise<void>;
}

// Utility function to format time display
const formatTimeDisplay = (timeString: string) => {
  try {
    // If timeString already includes AM/PM, return it formatted consistently
    if (/\b(am|pm|AM|PM)\b/.test(timeString)) {
      // If it's already properly formatted, return as is
      if (/^\d{1,2}:\d{2}\s?(am|pm|AM|PM)$/.test(timeString)) {
        return timeString.toUpperCase();
      }

      // Try to extract hours and minutes
      const timeParts = timeString.match(/(\d{1,2}):(\d{2})\s?(am|pm|AM|PM)/i);
      if (timeParts) {
        return `${timeParts[1]}:${timeParts[2]} ${timeParts[3].toUpperCase()}`;
      }
    }

    // If timeString is in 24-hour format (HH:MM)
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM
      return `${hour12}:${minutes} ${ampm}`;
    }

    // Try to parse as a date object
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // If all else fails, return original
    return timeString;
  } catch (e) {
    console.error("Error formatting time:", e);
    return timeString;
  }
};

const CarpoolDashboard = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postedRides, setPostedRides] = useState<PostedRide[]>([]);
  const [bookedRides, setBookedRides] = useState<BookedRide[]>([]);
  const [completedRides, setCompletedRides] = useState<CompletedRide[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated for carpool
    const userDataStr = localStorage.getItem("userData");

    if (!userDataStr) {
      toast.error("Please login to access this page");
      navigate("/carpool-login");
      return;
    }

    try {
      const userData = JSON.parse(userDataStr);
      if (!userData.isLoggedIn || userData.type !== "carpool") {
        toast.error("Unauthorized access");
        navigate("/carpool-login");
        return;
      }

      setUserData(userData);

      // After authentication is confirmed, fetch data
      fetchUserRides(userData.token);
      fetchOfferedRides(userData.token);
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Session error. Please login again.");
      navigate("/carpool-login");
    }
  }, [navigate]);

  // Fetch rides booked by the user
  const fetchUserRides = async (token: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get<{ data: { data: any[] } }>(`${API_BASE_URL}/user-rides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("userRides:-",res);

      // Split into upcoming and past rides
      const now = new Date();
      const upcoming: BookedRide[] = [];
      const past: CompletedRide[] = [];

      Array.isArray(res.data.data) && res.data.data.forEach((ride: any) => {
        const rideDate = new Date(ride.date);
        // Improved date/time handling with error checking
        let formattedTime = "Time not available";
        try {
          formattedTime = new Date(ride.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } catch (e) {
          console.error("Error formatting time:", e);
        }

        if (rideDate > now) {
          upcoming.push({
            id: ride._id,
            from: ride.from,
            to: ride.to,
            date: new Date(ride.date).toLocaleDateString(),
            time: ride.time
              ? formatTimeDisplay(ride.time)
              : formatTimeDisplay(new Date(ride.date).toISOString()),
            price: ride.pricePerSeat,
            status: "Confirmed",
            driver: {
              name: ride.driver?.name || "Unknown",
              rating: "4.8",
              car: ride.carDetails || "Not specified",
            },
          });
        } else {
          past.push({
            id: ride._id,
            from: ride.from,
            to: ride.to,
            date: new Date(ride.date).toLocaleDateString(),
            type: "Passenger",
            price: ride.pricePerSeat,
            driver: {
              name: ride.driver?.name || "Unknown",
              rating: "4.8",
            },
          });
        }
      });

      setBookedRides(upcoming);

      // Add past rides to completedRides, avoiding duplicates
      setCompletedRides((prevRides) => {
        const existingIds = new Set(prevRides.map((r) => r.id));
        const newRides = past.filter((r) => !existingIds.has(r.id));
        return [...prevRides, ...newRides];
      });
    } catch (error) {
      console.error("Error fetching booked rides:", error);
      toast.error("Failed to load your booked rides");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch rides offered by the user
  const fetchOfferedRides = async (token: string) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/offered-rides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Split into upcoming and past rides
      const now = new Date();
      const upcoming: PostedRide[] = [];
      const past: CompletedRide[] = [];

      (res.data as { data: any[] }).data.forEach((ride: any) => {
        const rideDate = new Date(ride.date);
        const passengers = ride.passengers.map((p: any) => ({
          id: p.user._id,
          name: p.user.name,
          pickupPoint: p.pickupPoint || "Default pickup",
        }));

        // Improved date/time handling with error checking
        let formattedTime = "Time not available";
        try {
          formattedTime = new Date(ride.date).toISOString().split("T")[0];
        } catch (e) {
          console.error("Error formatting time:", e);
        }

        if (rideDate > now) {
          upcoming.push({
            id: ride._id,
            from: ride.from,
            to: ride.to,
            date: new Date(ride.date).toLocaleDateString(),
            time: formattedTime,
            availableSeats: ride.availableSeats,
            price: ride.pricePerSeat,
            status: "Active",
            passengers: passengers,
          });
        } else {
          past.push({
            id: ride._id,
            from: ride.from,
            to: ride.to,
            date: new Date(ride.date).toLocaleDateString(),
            type: "Driver",
            passengers: passengers.length,
            totalEarnings: ride.pricePerSeat * passengers.length,
          });
        }
      });

      setPostedRides(upcoming);

      // Add to completedRides, avoiding duplicates
      setCompletedRides((prevRides) => {
        const existingIds = new Set(prevRides.map((r) => r.id));
        const newRides = past.filter((r) => !existingIds.has(r.id));
        return [...prevRides, ...newRides];
      });
    } catch (error) {
      console.error("Error fetching offered rides:", error);
      toast.error("Failed to load your offered rides");
    }
  };

  const parseDate = (dateStr: string): string => {
    // First attempt: Try creating a date object directly from the input string
    let dateObj = new Date(dateStr);
    
    if (isNaN(dateObj.getTime())) {
      // If the date is invalid, remove the ordinal suffix (st, nd, rd, th)
      const cleanedDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/g, '$1');
      dateObj = new Date(cleanedDateStr);  // Attempt to parse again after cleaning
      
      // If still invalid, try splitting the date into its parts manually
      if (isNaN(dateObj.getTime())) {
        // Handling month names, e.g., "April 3, 2025"
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Split the input date string into its components
        const dateParts = dateStr.split(/[\s,]+/);
        const monthStr = dateParts[0]; // First part is the month (e.g., "April")
        const day = parseInt(dateParts[1].replace(/\D/g, '')); // Second part is the day (e.g., "3")
        const year = parseInt(dateParts[2]); // Third part is the year (e.g., "2025")
        
        const month = months.findIndex(m => m.toLowerCase().startsWith(monthStr.toLowerCase().substring(0, 3))); // Match month by its first 3 letters
  
        // If valid month, day, and year are parsed
        if (month >= 0 && !isNaN(day) && !isNaN(year)) {
          dateObj = new Date(year, month, day);
        }
      }
    }
  
    // Check if the date is still invalid after all attempts
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date format");
    }
  
    // Return the formatted date as YYYY-MM-DD (ISO 8601 format)
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
  };
  
  const incrementDateByOne = (formattedDate: string): string => {
    // Parse the formattedDate (YYYY-MM-DD)
    const dateObj = new Date(formattedDate);
  
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date format");
    }
  
    // Increment the date by 1 day
    dateObj.setDate(dateObj.getDate() + 1);
  
    // Return the new formatted date (YYYY-MM-DD)
    return dateObj.toISOString().split('T')[0]; // YYYY-MM-DD format
  };
  
  
  const handleSearch = async (searchData: any) => {
    console.log("Starting search with data:", searchData);
    setIsLoading(true); // Show loading indicator
  
    try {
      // Validate required fields
      if (!searchData.from || !searchData.to) {
        console.log("Validation failed: Missing 'From' or 'To' locations");
        toast.error("Please enter both 'From' and 'To' locations");
        setIsLoading(false);
        return;
      }
  
      console.log("Validation passed");
  
      // Format date if provided
      let formattedDate = "";
      if (searchData.date) {
        try {
          console.log("Formatting date:", searchData.date);
          formattedDate = parseDate(searchData.date); // Using the helper function to parse the date
          console.log("Formatted date:", formattedDate);
        } catch (e) {
          console.error("Invalid date format:", searchData.date, e);
          toast.error("Please enter a valid date in format MM/DD/YYYY or Month Day, Year");
          setIsLoading(false);
          return;
        }
      }
  
      // Prepare the URL with encoded 'from' and 'to' locations
      const fromEncoded = encodeURIComponent(searchData.from.trim());
      const toEncoded = encodeURIComponent(searchData.to.trim());
      console.log("Encoded 'from':", fromEncoded);
      console.log("Encoded 'to':", toEncoded);
  
      // Only append the date parameter if it exists
      const dateParam = formattedDate ? `/${incrementDateByOne(formattedDate)}` : "";
      console.log("Date parameter for URL:", dateParam);
  
      // Construct the full URL for the API request
      const url = `${API_BASE_URL}/search/${fromEncoded}/${toEncoded}${dateParam}`;
      console.log("Constructed API URL:", url);
  
      // Check if the token is available
      if (!userData?.token) {
        console.log("Authorization token is missing");
        toast.error("Authorization token is missing.");
        setIsLoading(false);
        return;
      }
  
      console.log("Authorization token is available");
  
      // Make the request to the API
      console.log("Sending API request...");
      const res = await axios.get<{ success: boolean; data: any[] }>(url, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
  
      console.log("API response received:", res.data);
  
      // Check for successful response and valid data
      if (!res.data.success || !Array.isArray(res.data.data)) {
        console.log("Invalid API response structure");
        throw new Error("Invalid API response structure");
      }
  
      console.log("API response is valid");
  
      // Format the results for displaying in the UI
      console.log("Formatting search results...");
      const formattedResults = res.data.data.map((ride: any) => {
        const rideDate = ride.date ? new Date(ride.date) : new Date();
        return {
          id: ride._id,
          from: ride.from,
          to: ride.to,
          date: rideDate.toLocaleDateString(),
          time: ride.time ? formatTimeDisplay(ride.time) : formatTimeDisplay(rideDate.toISOString()),
          price: ride.pricePerSeat || 0,
          availableSeats: ride.availableSeats || 0,
          driver: {
            name: ride.driver?.name || "Unknown",
            rating: ride.driver?.rating || "4.8", // Default rating
          },
        };
      });
  
      // Check if no results were found
      if (formattedResults.length === 0) {
        console.log("No rides found for the given search criteria.");
        toast.info("No rides available for the selected search criteria.");
      }
  
      console.log("Formatted results:", formattedResults);
  
      // Set the results and show them in the UI
      setSearchResults(formattedResults);
      setShowResults(true);
      console.log("Search results updated in state");
  
    } catch (error) {
      console.error("Error searching rides:", error);
  
      // If it's an Axios error, handle it with a detailed message
      if ((error as any).isAxiosError) {
        console.log("Axios error occurred:", error.response?.data?.message);
        toast.error(error.response?.data?.message || "Failed to search for rides");
      } else {
        console.log("Unexpected error occurred:", error.message);
        toast.error(error.message || "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false); // Hide loading indicator after all is done
      console.log("Search process completed");
    }
  };
  

  

  // Handler for canceling a ride offering
  const handleCancelRide = async (rideId: string) => {
    try {
      await axios.post(
        `/api/carpool/rides/${rideId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      toast.success("Ride cancelled successfully", {
        description: "All passengers have been notified.",
      });

      // Refresh the ride data
      fetchUserRides(userData.token);
      await fetchOfferedRides(userData.token);
    } catch (error) {
      console.error("Error cancelling ride:", error);
      toast.error("Failed to cancel ride");
    }
  };

  // Handler for canceling a booking
  const handleCancelBooking = async (rideId: string) => {
    try {
      await axios.post(
        `/api/carpool/rides/${rideId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      toast.success("Booking cancelled successfully");

      // Refresh the booked rides
      fetchUserRides(userData.token);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    }
  };

  const handlePostRide = async (rideData: any) => {
    try {
      await axios.post("/api/carpool/rides", rideData, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Ride posted successfully!");
      // Refresh the posted rides
      fetchOfferedRides(userData.token);

      // Switch to the My Rides tab
      const myRidesTab = document.querySelector('[value="myRides"]');
      if (myRidesTab instanceof HTMLElement) {
        myRidesTab.click();
      }
    } catch (error) {
      console.error("Error posting ride:", error);
      toast.error("Failed to post ride");
    }
  };

  const handleBookRide = async (rideId: string) => {
    try {
      await axios.post(
        `/api/carpool/rides/${rideId}/book`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      toast.success("Ride booked successfully!");

      // Refresh the booked rides
      fetchUserRides(userData.token);

      // Also refresh the search results
      if (showResults) {
        // Remove the booked ride from search results or refresh the search
        setSearchResults((prevResults) =>
          prevResults
            .map((ride) =>
              ride.id === rideId
                ? { ...ride, availableSeats: ride.availableSeats - 1 }
                : ride
            )
            .filter((ride) => ride.availableSeats > 0)
        );
      }

      // Switch to the My Rides tab
      (document.querySelector('[value="myRides"]') as HTMLElement)?.click();
    } catch (error: any) {
      console.error("Error booking ride:", error);
      toast.error(error.response?.data?.message || "Failed to book ride");
    }
  };

  // Navigation to the tabs from the empty state
  const navigateToTab = (tab: string) => {
    // First, set the parent tabs to "findRide" or "offerRide"
    const parentTabElement = document.querySelector(`[value="${tab}"]`);

    if (parentTabElement) {
      // Create and dispatch a click event
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      parentTabElement.dispatchEvent(clickEvent);

      // Log success for debugging
      console.log(`Successfully navigated to ${tab} tab`);
    } else {
      console.error(`Could not find tab with value: ${tab}`);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    navigate("/login");
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
      <Navbar onLogout={handleLogout} />
      <div className="pt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Carpool Dashboard
              </h1>
              <p className="text-muted-foreground">
                Find rides, offer rides, and reduce your carbon footprint.
              </p>
            </div>

            <Tabs defaultValue="myRides" className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="myRides">My Rides</TabsTrigger>
                <TabsTrigger value="findRide">Find a Ride</TabsTrigger>
                <TabsTrigger value="offerRide">Offer a Ride</TabsTrigger>
              </TabsList>

              <TabsContent value="myRides">
                <Tabs defaultValue="upcoming" className="w-full">
                  <TabsList className="inline-flex mb-6">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past Rides</TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming">
                    <div className="space-y-8">
                      {postedRides.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Rides You're Offering
                          </h3>
                          <div className="space-y-4">
                            {postedRides.map((ride) => (
                              <div
                                key={ride.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
                              >
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                  <div>
                                    <h4 className="text-lg font-semibold">
                                      {ride.from} to {ride.to}
                                    </h4>
                                    <div className="flex flex-wrap gap-x-4 mt-2 text-sm">
                                      <div className="flex items-center">
                                        <Calendar
                                          size={16}
                                          className="mr-1 text-muted-foreground"
                                        />
                                        <span>{ride.date}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Clock
                                          size={16}
                                          className="mr-1 text-muted-foreground"
                                        />
                                        <span>
                                          {ride.time
                                            ? formatTimeDisplay(ride.time)
                                            : "Time not available"}
                                        </span>
                                      </div>
                                      <div className="flex items-center">
                                        <Users
                                          size={16}
                                          className="mr-1 text-muted-foreground"
                                        />
                                        <span>
                                          {ride.availableSeats} seats available
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 text-right">
                                    <Badge>{ride.status}</Badge>
                                    <div className="font-semibold mt-2">
                                      ₹{ride.price} per seat
                                    </div>
                                  </div>
                                </div>

                                {ride.passengers.length > 0 && (
                                  <div className="mb-4">
                                    <h5 className="font-medium mb-2">
                                      Passengers ({ride.passengers.length})
                                    </h5>
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                                      {ride.passengers.map((passenger) => (
                                        <div
                                          key={passenger.id}
                                          className="flex justify-between items-center"
                                        >
                                          <div>{passenger.name}</div>
                                          <div className="text-sm text-muted-foreground">
                                            Pickup: {passenger.pickupPoint}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button
                                    variant="outline"
                                    className="sm:flex-1"
                                    onClick={() => handleCancelRide(ride.id)}
                                  >
                                    Cancel Ride
                                  </Button>
                                  <Button
                                    className="sm:flex-1"
                                    onClick={() =>
                                      toast.info(
                                        "Ride editing feature coming soon"
                                      )
                                    }
                                  >
                                    Edit Details
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {bookedRides.length > 0 && (
                        <div>
                          <h3 className="text-xl font-semibold mb-4">
                            Rides You've Booked
                          </h3>
                          <div className="space-y-4">
                            {bookedRides.map((ride) => (
                              <div
                                key={ride.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
                              >
                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                  <div>
                                    <h4 className="text-lg font-semibold">
                                      {ride.from} to {ride.to}
                                    </h4>
                                    <div className="flex flex-wrap gap-x-4 mt-2 text-sm">
                                      <div className="flex items-center">
                                        <Calendar
                                          size={16}
                                          className="mr-1 text-muted-foreground"
                                        />
                                        <span>{ride.date}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Clock
                                          size={16}
                                          className="mr-1 text-muted-foreground"
                                        />
                                        <span>
                                          {ride.time
                                            ? formatTimeDisplay(ride.time)
                                            : "Time not available"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <div className="text-sm">
                                        Driver: {ride.driver.name} (
                                        {ride.driver.rating} ★)
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Car: {ride.driver.car}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 text-right">
                                    <Badge variant="outline">
                                      {ride.status}
                                    </Badge>
                                    <div className="font-semibold mt-2">
                                      ₹{ride.price}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button
                                    variant="outline"
                                    className="sm:flex-1"
                                    onClick={() => handleCancelBooking(ride.id)}
                                  >
                                    Cancel Booking
                                  </Button>
                                  <Button
                                    className="sm:flex-1"
                                    onClick={() =>
                                      toast.info("Contact feature coming soon")
                                    }
                                  >
                                    Contact Driver
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {postedRides.length === 0 && bookedRides.length === 0 && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                          <Car
                            size={64}
                            className="mx-auto text-muted-foreground mb-4"
                          />
                          <h3 className="text-xl font-semibold mb-2">
                            No Upcoming Rides
                          </h3>
                          <p className="text-muted-foreground max-w-md mx-auto mb-6">
                            You don't have any upcoming rides. Offer a ride or
                            find a ride to get started.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={() => navigateToTab("findRide")}>
                              Find a Ride
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => navigateToTab("offerRide")}
                            >
                              Offer a Ride
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="past">
                    {completedRides.length > 0 ? (
                      <div className="space-y-4">
                        {completedRides.map((ride) => (
                          <div
                            key={ride.id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6"
                          >
                            <div className="flex flex-col md:flex-row justify-between">
                              <div>
                                <h4 className="text-lg font-semibold">
                                  {ride.from} to {ride.to}
                                </h4>
                                <div className="flex items-center mt-2 text-sm">
                                  <Calendar
                                    size={16}
                                    className="mr-1 text-muted-foreground"
                                  />
                                  <span>{ride.date}</span>
                                </div>

                                {ride.type === "Passenger" && ride.driver && (
                                  <div className="mt-2">
                                    <div className="text-sm">
                                      Driver: {ride.driver.name} (
                                      {ride.driver.rating} ★)
                                    </div>
                                  </div>
                                )}

                                {ride.type === "Driver" && (
                                  <div className="mt-2 text-sm">
                                    <span>{ride.passengers} passengers</span>
                                  </div>
                                )}
                              </div>
                              <div className="mt-4 md:mt-0 text-right">
                                <Badge variant="secondary">{ride.type}</Badge>
                                {ride.type === "Passenger" && ride.price && (
                                  <div className="font-semibold mt-2">
                                    Paid: ₹{ride.price}
                                  </div>
                                )}
                                {ride.type === "Driver" &&
                                  ride.totalEarnings && (
                                    <div className="font-semibold mt-2">
                                      Earned: ₹{ride.totalEarnings}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <Car
                          size={64}
                          className="mx-auto text-muted-foreground mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">
                          No Past Rides
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                          Your completed rides will appear here.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="findRide">
                <div className="max-w-2xl mx-auto mb-10">
                  <SearchRideForm onSearch={handleSearch} />
                </div>

                {isLoading ? (
                  <div className="text-center py-12">
                    <p>Loading available rides...</p>
                  </div>
                ) : (
                  showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold mb-6">
                        Available Rides
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {searchResults.length > 0 ? (
                          searchResults.map((ride, index) => (
                            <RideCard
                              key={ride.id}
                              ride={ride}
                              index={index}
                              onBookRide={() => handleBookRide(ride.id)}
                            />
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                            <MapPin
                              size={64}
                              className="mx-auto text-muted-foreground mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-2">
                              No Rides Found
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6">
                              No rides matching your criteria were found. Try
                              different locations or dates.
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                )}
              </TabsContent>

              <TabsContent value="offerRide">
                <div className="max-w-2xl mx-auto">
                  <PostRideForm onSubmit={handlePostRide} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Footer />
      <SOSButton />
    </motion.div>
  );
};

export default CarpoolDashboard;