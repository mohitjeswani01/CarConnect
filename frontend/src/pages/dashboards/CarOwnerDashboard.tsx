import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import SOSButton from "@/components/sos-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

// Imported components
import CarListingCard from "@/components/dashboard/car-owner/CarListingCard";
import RentalRecordsTable from "@/components/dashboard/car-owner/RentalRecordsTable";
import AddCarForm from "@/components/dashboard/car-owner/AddCarForm";

// API
import { carOwnerAPI } from "@/services/api";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarListingCardProps {
  car: CarListing;
  onToggleAvailability: (carId: string) => void;
}

interface CarFeatures {
  seats: number;
  transmission: string;
  fuelType: string;
  mileage: string;
}

interface CarListing {
  id: string;
  model: string;
  category: string;
  available: boolean;
  price: number;
  rentalPeriod: string;
  location: string;
  image: string;
  features: CarFeatures;
}

interface RentalRecord {
  id: string;
  carModel: string;
  renterId: string;
  renterName: string;
  startDate: string;
  endDate: string;
  status: string;
  hasDriver: boolean;
}

const CarOwnerDashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [carListings, setCarListings] = useState<any>([]);
  const [rentalRecords, setRentalRecords] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a car owner
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
      userData.role !== "owner"
    ) {
      toast.error("Unauthorized access");
      navigate("/login");
      return;
    }

    setUserData(userData);

    // Load data from the API
    fetchOwnerData();
  }, [navigate]);

  const fetchOwnerData = async () => {
    setIsLoading(true);
    try {
      // Fetch data in parallel
      const [listingsResponse, recordsResponse] = await Promise.all([
        carOwnerAPI.getCarListings(),
        carOwnerAPI.getRentalRecords(),
      ]);

      // Map the backend response to match our frontend interfaces
      const mappedCarListings = listingsResponse.data.data.map((car: any) => ({
        id: car._id,
        model: `${car.make} ${car.model}`,
        category: car.category || "Standard",
        available: car.isAvailable,
        price: car.pricePerDay,
        rentalPeriod: "day",
        location: car.location || "Not specified",
        image:
          car.photos && car.photos.length > 0
            ? `http://localhost:5050${car.photos[0]}`
            : "https://via.placeholder.com/300x200?text=No+Image",
        features: {
          seats: car.features?.includes("seats")
            ? parseInt(
              car.features
                .find((f: string) => f.includes("seats"))
                .split(" ")[0]
            )
            : 5,
          transmission: car.features?.includes("Automatic")
            ? "Automatic"
            : "Manual",
          fuelType: car.features?.includes("Diesel") ? "Diesel" : "Petrol",
          mileage: car.features?.includes("mileage")
            ? car.features.find((f: string) => f.includes("mileage"))
            : "15 km/l",
        },
      }));

      const mappedRentalRecords = recordsResponse.data.data.map(
        (record: any) => ({
          id: record._id,
          carModel: `${record.car.make} ${record.car.model}`,
          renterId: record.renter._id,
          renterName: record.renter.name,
          startDate: new Date(record.startDate).toLocaleDateString(),
          endDate: new Date(record.endDate).toLocaleDateString(),
          status:
            record.status.charAt(0).toUpperCase() + record.status.slice(1),
          hasDriver: record.withDriver,
        })
      );

      setCarListings(mappedCarListings);
      setRentalRecords(mappedRentalRecords);
    } catch (error) {
      console.error("Error fetching owner data:", error);
      toast.error("Failed to load car owner data", {
        description: "Please check your connection and try again.",
      });

      // Fallback to sample data if API fails
      import("@/components/dashboard/car-owner/carOwnerData").then((data) => {
        setCarListings(data.carListings);
        setRentalRecords(data.rentalRecords);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAvailability = async (carId: string) => {
    try {
      await carOwnerAPI.toggleCarAvailability(carId);

      // Update local state
      setCarListings((prev) =>
        prev.map((car) =>
          car.id === carId ? { ...car, available: !car.available } : car
        )
      );

      toast.success(`Car availability status updated!`, {
        description: "Renters will now see the updated availability.",
      });
    } catch (error) {
      console.error("Error updating car availability:", error);
      toast.error("Failed to update car availability");
    }
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get form data
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      // Submit to API
      await carOwnerAPI.addCar(formData);

      toast.success("New car added successfully!", {
        description: "Your car is now listed for rent.",
      });

      // Refresh car listings
      fetchOwnerData();

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error("Failed to add new car", {
        description: "Please try again later.",
      });
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
                Car Owner Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage your car listings, availability, and track rental
                requests.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Tabs defaultValue="listings" className="w-full">
                <TabsList className="grid grid-cols-3 mb-8">
                  <TabsTrigger value="listings">My Car Listings</TabsTrigger>
                  <TabsTrigger value="rentalRecords">
                    Rental Records
                  </TabsTrigger>
                  <TabsTrigger value="addCar">Add New Car</TabsTrigger>
                </TabsList>

                <TabsContent value="listings">
                  {carListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {carListings.map((car) => (
                        <CarListingCard
                          key={car.id}
                          car={car}
                          onToggleAvailability={handleToggleAvailability}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                      <Car
                        size={64}
                        className="mx-auto text-muted-foreground mb-4"
                      />
                      <h3 className="text-xl font-semibold mb-2">
                        No Cars Listed
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto mb-6">
                        You haven't added any cars to your listings yet. Add
                        your first car to start renting it out.
                      </p>
                      <Button
                        onClick={() =>
                          document
                            .querySelector('[value="addCar"]')
                            ?.dispatchEvent(
                              new MouseEvent("click", { bubbles: true })
                            )
                        }
                      >
                        Add Your First Car
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="rentalRecords">
                  <RentalRecordsTable rentalRecords={rentalRecords} />
                </TabsContent>

                <TabsContent value="addCar">
                  <AddCarForm onSubmit={handleAddCar} />
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

export default CarOwnerDashboard;
