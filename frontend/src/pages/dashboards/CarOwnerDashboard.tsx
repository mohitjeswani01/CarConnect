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
import { carListings as carListingsType, rentalRecords as rentalRecordsType } from "@/components/dashboard/car-owner/carOwnerData";

// Define types based on the imported sample data
type CarListing = typeof carListingsType[0];
type RentalRecord = typeof rentalRecordsType[0];

const CarOwnerDashboard = () => {
    const [userData, setUserData] = useState<any>(null);
    const [carListings, setCarListings] = useState<CarListing[]>([]);
    const [rentalRecords, setRentalRecords] = useState<RentalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated and is a car owner
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            toast.error("Please login to access this page");
            navigate("/login");
            return;
        }

        const userData = JSON.parse(userDataStr);
        if (!userData.isLoggedIn || userData.type !== "carRental" || userData.role !== "owner") {
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
                carOwnerAPI.getRentalRecords()
            ]);

            // Ensure the data is an array
            if (Array.isArray(listingsResponse.data)) {
                setCarListings(listingsResponse.data);
            } else {
                throw new Error("Invalid data format for car listings");
            }

            if (Array.isArray(recordsResponse.data)) {
                setRentalRecords(recordsResponse.data);
            } else {
                throw new Error("Invalid data format for rental records");
            }
        } catch (error) {
            console.error("Error fetching owner data:", error);
            toast.error("Failed to load car owner data", {
                description: "Please check your connection and try again."
            });

            // Fallback to sample data if API fails
            import("@/components/dashboard/car-owner/carOwnerData").then(data => {
                setCarListings(data.carListings);
                setRentalRecords(data.rentalRecords);
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleAvailability = async (carId: number) => {
        try {
            await carOwnerAPI.toggleCarAvailability(carId);

            // Update local state
            setCarListings(prev =>
                prev.map(car =>
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

            // Refresh car listings
            const response = await carOwnerAPI.getCarListings();
            setCarListings(response.data);

            toast.success("New car added successfully!", {
                description: "Your car is now listed for rent.",
            });

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
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Car Owner Dashboard</h1>
                            <p className="text-muted-foreground">
                                Manage your car listings, availability, and track rental requests.
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
                                    <TabsTrigger value="rentalRecords">Rental Records</TabsTrigger>
                                    <TabsTrigger value="addCar">Add New Car</TabsTrigger>
                                </TabsList>

                                <TabsContent value="listings">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {carListings && carListings.map((car) => (
                                            <CarListingCard
                                                key={car.id}
                                                car={car}
                                                onToggleAvailability={handleToggleAvailability}
                                            />
                                        ))}
                                    </div>
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
