import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import SOSButton from "@/components/sos-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Car,
  CalendarRange,
  MapPin,
  Search,
  Filter,
  Gauge,
  Users,
  Fuel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { carRenterAPI } from "@/services/api";

// Define interfaces for the data
interface CarFeatures {
  seats: number;
  transmission: string;
  fuelType: string;
  mileage: string;
}

interface CarOwner {
  name: string;
  rating: number;
}

interface AvailableCar {
  id: string;
  model: string;
  category: string;
  price: number;
  rentalPeriod: string;
  location: string;
  image: string;
  features: CarFeatures;
  owner: CarOwner;
}

interface Booking {
  id: string;
  carModel: string;
  category: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: string;
  withDriver: boolean;
  image: string;
}

const CarRenterDashboard = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [carType, setCarType] = useState("all");
  const [userData, setUserData] = useState<any>(null);
  const [availableCars, setAvailableCars] = useState<AvailableCar[]>([]);
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a car renter
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) {
      toast.error("Please login to access this page");
      navigate("/login");
      return;
    }

    const userData = JSON.parse(userDataStr);
    if (
      !userData.isLoggedIn ||
      userData.type !== "carRental" ||
      userData.role !== "renter"
    ) {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }

    setUserData(userData);

    // Load data
    fetchCarsAndBookings();
  }, [navigate]);

  const fetchCarsAndBookings = async () => {
    setIsLoading(true);
    try {
      // Search cars with no filters initially
      const carsResponse = await carRenterAPI.searchCars();
      console.log("API Response:", carsResponse.data);

      // Map backend data to our frontend interface
      const mappedCars = carsResponse.data.data.map((car: any) => ({
        id: car._id,
        model: `${car.make} ${car.model}`,
        category: car.category || "Standard",
        price: car.pricePerDay,
        rentalPeriod: "day",
        location: car.location || "Not specified",
        image:
          car.photos && car.photos.length > 0
            ? `http://localhost:5050${car.photos[0]}`
            : "https://via.placeholder.com/300x200?text=No+Image",
        features: {
          seats: getFeatureValue(car.features, "seats", 5),
          transmission: getTransmissionType(car.features),
          fuelType: getFuelType(car.features),
          mileage: getFeatureValue(car.features, "mileage", "15 km/l"),
        },
        owner: {
          name: car.owner?.name || "Car Owner",
          rating: 4.5, // Default rating if not available
        },
      }));

      setAvailableCars(mappedCars);

      // Fetch current bookings
      const bookingsResponse = await carRenterAPI.getBookings();
      console.log("Bookings Response:", bookingsResponse.data);

      // Map backend data to our frontend interface
      const mappedBookings = bookingsResponse.data.data.map((booking: any) => ({
        id: booking._id,
        carModel: `${booking.car?.make || ""} ${booking.car?.model || ""}`,
        category: booking.car?.category || "Standard",
        startDate: new Date(booking.startDate).toLocaleDateString(),
        endDate: new Date(booking.endDate).toLocaleDateString(),
        totalAmount: booking.totalPrice,
        status:
          booking.status === "active"
            ? "Active"
            : new Date(booking.startDate) > new Date()
              ? "Upcoming"
              : booking.status === "completed"
                ? "Completed"
                : booking.status,
        withDriver: booking.withDriver,
        image:
          booking.car?.photos && booking.car.photos.length > 0
            ? `http://localhost:5050${booking.car.photos[0]}`
            : "https://via.placeholder.com/300x200?text=No+Image",
      }));

      setCurrentBookings(mappedBookings);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data", {
        description: "Please check your connection and try again.",
      });

      // Use sample data as fallback
      // setAvailableCars([
      //   {
      //     id: "1",
      //     model: "Maruti Swift",
      //     category: "Hatchback",
      //     price: 800,
      //     rentalPeriod: "day",
      //     location: "Delhi, India",
      //     image: "images/swift.png",
      //     features: {
      //       seats: 5,
      //       transmission: "Manual",
      //       fuelType: "Petrol",
      //       mileage: "21 km/l",
      //     },
      //     owner: {
      //       name: "Rahul Verma",
      //       rating: 4.8,
      //     },
      //   },
      //   // Add more sample cars as needed
      // ]);

      setCurrentBookings([
        // {
        //   id: "101",
        //   carModel: "Maruti Swift",
        //   category: "Hatchback",
        //   startDate: "2023-10-15",
        //   endDate: "2023-10-18",
        //   totalAmount: 2400,
        //   status: "Active",
        //   withDriver: false,
        //   image: "images/swift.png",
        // },
        // Add more sample bookings as needed
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to extract features safely
  const getFeatureValue = (
    features: string[] | undefined,
    key: string,
    defaultValue: any
  ) => {
    if (!features || !Array.isArray(features)) return defaultValue;

    const feature = features.find((f) => f.includes(key));
    if (!feature) return defaultValue;

    if (key === "seats") {
      const match = feature.match(/(\d+)\s+seats/);
      return match ? parseInt(match[1]) : defaultValue;
    }

    return feature;
  };

  const getTransmissionType = (features: string[] | undefined) => {
    if (!features || !Array.isArray(features)) return "Manual";
    return features.some((f) => f.toLowerCase().includes("automatic"))
      ? "Automatic"
      : "Manual";
  };

  const getFuelType = (features: string[] | undefined) => {
    if (!features || !Array.isArray(features)) return "Petrol";
    if (features.some((f) => f.toLowerCase().includes("diesel")))
      return "Diesel";
    if (features.some((f) => f.toLowerCase().includes("electric")))
      return "Electric";
    return "Petrol";
  };

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const response = await carRenterAPI.searchCars(
        searchLocation,
        carType !== "all" ? carType : undefined
      );
      console.log("Search Response:", response.data);

      // Map backend data to our frontend interface using the same mapping logic
      const mappedCars = response.data.data.map((car: any) => ({
        id: car._id,
        model: `${car.make} ${car.model}`,
        category: car.category || "Standard",
        price: car.pricePerDay,
        rentalPeriod: "day",
        location: car.location || "Not specified",
        image:
          car.photos && car.photos.length > 0
            ? `http://localhost:5050${car.photos[0]}`
            : "https://via.placeholder.com/300x200?text=No+Image",
        features: {
          seats: getFeatureValue(car.features, "seats", 5),
          transmission: getTransmissionType(car.features),
          fuelType: getFuelType(car.features),
          mileage: getFeatureValue(car.features, "mileage", "15 km/l"),
        },
        owner: {
          name: car.owner?.name || "Car Owner",
          rating: 4.5, // Default rating if not available
        },
      }));

      setAvailableCars(mappedCars);

      if (mappedCars.length === 0) {
        toast.info("No cars found", {
          description: "Try different search criteria.",
        });
      }
    } catch (error) {
      console.error("Error searching cars:", error);
      toast.error("Failed to search cars");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentCar = async (carId: string, withDriver: boolean) => {
    try {
      // For a real implementation, show a date picker to get dates from user
      // For now, we'll use current date and +3 days
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 3); // 3 days from now

      const bookingData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        withDriver,
        status: "approved", // Set the status to pending
      };

      console.log("Booking data:", bookingData);

      const response = await carRenterAPI.bookCar(carId, bookingData);
      console.log("Booking response:", response.data);

      toast.success(`Car booking requested successfully!`, {
        description: withDriver
          ? "Your request for a car with driver has been sent to the owner."
          : "Your request for a car without driver has been sent to the owner.",
      });

      // Refresh bookings
      fetchCarsAndBookings();

      // Switch to the bookings tab
      document
        .querySelector('[value="myBookings"]')
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    } catch (error: any) {
      console.error("Error booking car:", error);

      const errorMessage =
        error.message || "Please try again or contact support.";

      toast.error("Failed to book car", {
        description: errorMessage,
      });
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await carRenterAPI.cancelBooking(bookingId);

      toast.success("Booking cancelled successfully", {
        description: "Your refund will be processed within 3-5 business days.",
      });

      // Refresh bookings
      fetchCarsAndBookings();
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
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
                Car Renter Dashboard
              </h1>
              <p className="text-muted-foreground">
                Find and book cars for your next journey across India.
              </p>
            </div>

            <Tabs defaultValue="findCars" className="w-full">
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="findCars">Find Cars</TabsTrigger>
                <TabsTrigger value="myBookings">My Bookings</TabsTrigger>
              </TabsList>

              <TabsContent value="findCars">
                <div className="mb-8">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Location (City)"
                            className="pl-10"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <select
                          className="w-full h-10 rounded-md border border-input px-3 py-2 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={carType}
                          onChange={(e) => setCarType(e.target.value)}
                        >
                          <option value="all">All Car Types</option>
                          <option value="hatchback">Hatchback</option>
                          <option value="sedan">Sedan</option>
                          <option value="suv">SUV</option>
                          <option value="mpv">MPV</option>
                          <option value="luxury">Luxury</option>
                        </select>
                      </div>
                      <Button
                        className="flex items-center"
                        onClick={handleSearch}
                      >
                        <Search size={16} className="mr-2" />
                        Search Cars
                      </Button>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {availableCars.map((car) => (
                        <div
                          key={car.id}
                          className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
                        >
                          <div className="relative h-48">
                            <img
                              src={car.image}
                              alt={car.model}
                              className="h-full w-full object-cover"
                            />
                            <div className="absolute top-3 right-3">
                              <Badge>{car.category}</Badge>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-xl font-semibold">
                                  {car.model}
                                </h3>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin size={14} className="mr-1" />
                                  <span>{car.location}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-primary">
                                  ₹{car.price}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  per {car.rentalPeriod}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                              <div className="flex items-center">
                                <Users
                                  size={16}
                                  className="mr-2 text-muted-foreground"
                                />
                                <span>{car.features.seats} Seats</span>
                              </div>
                              <div className="flex items-center">
                                <Car
                                  size={16}
                                  className="mr-2 text-muted-foreground"
                                />
                                <span>{car.features.transmission}</span>
                              </div>
                              <div className="flex items-center">
                                <Fuel
                                  size={16}
                                  className="mr-2 text-muted-foreground"
                                />
                                <span>{car.features.fuelType}</span>
                              </div>
                              <div className="flex items-center">
                                <Gauge
                                  size={16}
                                  className="mr-2 text-muted-foreground"
                                />
                                <span>{car.features.mileage}</span>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleRentCar(car.id, false)}
                                className="flex-1"
                              >
                                Rent Without Driver
                              </Button>
                              <Button
                                onClick={() => handleRentCar(car.id, true)}
                                variant="outline"
                                className="flex-1"
                              >
                                Rent With Driver
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {availableCars.length === 0 && !isLoading && (
                        <div className="col-span-3 text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                          <Car
                            size={64}
                            className="mx-auto text-muted-foreground mb-4"
                          />
                          <h3 className="text-xl font-semibold mb-2">
                            No Cars Available
                          </h3>
                          <p className="text-muted-foreground mb-6">
                            No cars match your search criteria. Try a different
                            location or car type.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="myBookings">
                <div className="space-y-6">
                  {currentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                    >
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img
                            src={booking.image}
                            alt={booking.carModel}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:w-2/3">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-semibold">
                                {booking.carModel}
                              </h3>
                              <p className="text-muted-foreground">
                                {booking.category}
                              </p>
                            </div>
                            <Badge
                              variant={
                                booking.status === "Active"
                                  ? "default"
                                  : booking.status === "Upcoming"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <CalendarRange
                                size={16}
                                className="mr-2 text-muted-foreground"
                              />
                              <span>
                                {booking.startDate} to {booking.endDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <span className="text-muted-foreground mr-2">
                                  Total:
                                </span>
                                <span className="font-semibold">
                                  ₹{booking.totalAmount}
                                </span>
                              </div>
                              <div>
                                {booking.withDriver && (
                                  <Badge variant="outline" className="ml-2">
                                    With Driver
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {(booking.status === "Active" ||
                              booking.status === "Upcoming") && (
                                <Button
                                  variant="destructive"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  Cancel Booking
                                </Button>
                              )}
                            {booking.status === "Active" && (
                              <Button
                                variant="outline"
                                onClick={() => {
                                  // Open a modal to extend booking in a real implementation
                                  toast.info("Feature coming soon", {
                                    description:
                                      "Booking extension will be available soon.",
                                  });
                                }}
                              >
                                Extend Booking
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentBookings.length === 0 && !isLoading && (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                      <CalendarRange
                        size={64}
                        className="mx-auto text-muted-foreground mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        No Bookings Yet
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        You haven't made any car bookings yet. Start by finding
                        your perfect car for your next journey.
                      </p>
                      <Button
                        onClick={() =>
                          document
                            .querySelector('[value="findCars"]')
                            ?.dispatchEvent(
                              new MouseEvent("click", { bubbles: true })
                            )
                        }
                      >
                        Find Cars
                      </Button>
                    </div>
                  )}
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

export default CarRenterDashboard;
