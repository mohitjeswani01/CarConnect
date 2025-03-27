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
import { Car, CalendarRange, MapPin, Search, Filter, Gauge, Users, Fuel } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample data for available cars
const availableCars = [
    {
        id: 1,
        model: "Maruti Swift",
        category: "Hatchback",
        price: 800,
        rentalPeriod: "day",
        location: "Delhi, India",
        image: "images/swift.png",
        features: {
            seats: 5,
            transmission: "Manual",
            fuelType: "Petrol",
            mileage: "21 km/l",
        },
        owner: {
            name: "Rahul Verma",
            rating: 4.8,
        },
    },
    {
        id: 2,
        model: "Tata Nexon",
        category: "SUV",
        price: 1200,
        rentalPeriod: "day",
        location: "Delhi, India",
        image: "images/nexon2.png",
        features: {
            seats: 5,
            transmission: "Manual",
            fuelType: "Diesel",
            mileage: "19 km/l",
        },
        owner: {
            name: "Priya Singh",
            rating: 4.7,
        },
    },
    {
        id: 3,
        model: "Honda City",
        category: "Sedan",
        price: 1200,
        rentalPeriod: "day",
        location: "Mumbai, India",
        image: "images/city.png",
        features: {
            seats: 5,
            transmission: "Automatic",
            fuelType: "Petrol",
            mileage: "19 km/l",
        },
        owner: {
            name: "Vikram Patel",
            rating: 4.9,
        },
    },
    {
        id: 4,
        model: "Toyota Innova",
        category: "MPV",
        price: 2000,
        rentalPeriod: "day",
        location: "Bangalore, India",
        image: "images/innova.png",
        features: {
            seats: 7,
            transmission: "Manual",
            fuelType: "Diesel",
            mileage: "16 km/l",
        },
        owner: {
            name: "Arjun Sharma",
            rating: 4.6,
        },
    },
    {
        id: 5,
        model: "Mahindra XUV700",
        category: "SUV",
        price: 1800,
        rentalPeriod: "day",
        location: "Chennai, India",
        image: "images/700.png",
        features: {
            seats: 7,
            transmission: "Automatic",
            fuelType: "Diesel",
            mileage: "17 km/l",
        },
        owner: {
            name: "Neha Kapoor",
            rating: 4.5,
        },
    },
];

// Sample data for current bookings
const currentBookings = [
    {
        id: 101,
        carModel: "Maruti Swift",
        category: "Hatchback",
        startDate: "2023-10-15",
        endDate: "2023-10-18",
        totalAmount: 2400,
        status: "Active",
        withDriver: false,
        image: "images/swift.png",
    },
    {
        id: 102,
        carModel: "Honda City",
        category: "Sedan",
        startDate: "2023-11-01",
        endDate: "2023-11-05",
        totalAmount: 6000,
        status: "Upcoming",
        withDriver: true,
        image: "images/city.png",
    },
];

const CarRenterDashboard = () => {
    const [searchLocation, setSearchLocation] = useState("");
    const [carType, setCarType] = useState("all");
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated and is a car renter
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            toast.error("Please login to access this page");
            navigate("/login");
            return;
        }

        const userData = JSON.parse(userDataStr);
        if (!userData.isLoggedIn || userData.type !== "carRental" || userData.role !== "renter") {
            toast.error("Unauthorized access");
            navigate("/login");
            return;
        }

        setUserData(userData);
    }, [navigate]);

    const handleRentCar = (carId: number, withDriver: boolean) => {
        toast.success(`Car booked successfully!`, {
            description: withDriver
                ? "Your car with driver will be available at the selected time."
                : "Your car will be available for pickup at the selected time.",
        });
    };

    const handleCancelBooking = (bookingId: number) => {
        toast.success("Booking cancelled successfully", {
            description: "Your refund will be processed within 3-5 business days.",
        });
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
                        <div className="mb-10">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Car Renter Dashboard</h1>
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
                                            <Button className="flex items-center">
                                                <Search size={16} className="mr-2" />
                                                Search Cars
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {availableCars.map((car) => (
                                            <div key={car.id} className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
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
                                                            <h3 className="text-xl font-semibold">{car.model}</h3>
                                                            <div className="flex items-center text-sm text-muted-foreground">
                                                                <MapPin size={14} className="mr-1" />
                                                                <span>{car.location}</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-lg font-bold text-primary">₹{car.price}</div>
                                                            <div className="text-xs text-muted-foreground">per {car.rentalPeriod}</div>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                                                        <div className="flex items-center">
                                                            <Users size={16} className="mr-2 text-muted-foreground" />
                                                            <span>{car.features.seats} Seats</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Car size={16} className="mr-2 text-muted-foreground" />
                                                            <span>{car.features.transmission}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Fuel size={16} className="mr-2 text-muted-foreground" />
                                                            <span>{car.features.fuelType}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Gauge size={16} className="mr-2 text-muted-foreground" />
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
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="myBookings">
                                <div className="space-y-6">
                                    {currentBookings.map((booking) => (
                                        <div key={booking.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
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
                                                            <h3 className="text-xl font-semibold">{booking.carModel}</h3>
                                                            <p className="text-muted-foreground">{booking.category}</p>
                                                        </div>
                                                        <Badge
                                                            variant={
                                                                booking.status === "Active" ? "default" :
                                                                    booking.status === "Upcoming" ? "outline" :
                                                                        "secondary"
                                                            }
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="flex items-center mb-2">
                                                            <CalendarRange size={16} className="mr-2 text-muted-foreground" />
                                                            <span>
                                                                {booking.startDate} to {booking.endDate}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Car size={16} className="mr-2 text-muted-foreground" />
                                                            <span>{booking.withDriver ? "With Driver" : "Without Driver"}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="text-lg font-semibold">
                                                            Total: ₹{booking.totalAmount}
                                                        </div>
                                                        {booking.status === "Upcoming" && (
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleCancelBooking(booking.id)}
                                                            >
                                                                Cancel Booking
                                                            </Button>
                                                        )}
                                                        {booking.status === "Active" && (
                                                            <Button>
                                                                Extend Booking
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {currentBookings.length === 0 && (
                                        <div className="text-center py-12">
                                            <Car size={64} className="mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                                            <p className="text-muted-foreground mb-6">
                                                You haven't made any car bookings yet. Start by finding a car to rent.
                                            </p>
                                            <Button>Find Cars to Rent</Button>
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