import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

// Mock data for rides the user has posted
const postedRides = [
    {
        id: 501,
        from: "Gurgaon, Sector 56",
        to: "Delhi, Connaught Place",
        date: "Oct 28, 2023",
        time: "09:00 AM",
        availableSeats: 3,
        price: 150,
        passengers: [
            {
                id: "P1",
                name: "Rahul Kumar",
                pickupPoint: "Gurgaon, Sector 57",
            },
            {
                id: "P2",
                name: "Anjali Singh",
                pickupPoint: "Gurgaon, Sector 54",
            },
        ],
        status: "Upcoming",
    },
    {
        id: 502,
        from: "Delhi, Rohini",
        to: "Noida, Sector 62",
        date: "Oct 30, 2023",
        time: "08:30 AM",
        availableSeats: 2,
        price: 200,
        passengers: [],
        status: "Upcoming",
    },
];

// Mock data for rides the user has booked
const bookedRides = [
    {
        id: 601,
        from: "Noida, Sector 18",
        to: "Delhi, Karol Bagh",
        date: "Oct 26, 2023",
        time: "06:30 PM",
        driver: {
            name: "Vikas Sharma",
            rating: 4.7,
            car: "Honda City",
        },
        price: 180,
        status: "Confirmed",
    },
];

// Mock data for completed rides
const completedRides = [
    {
        id: 701,
        from: "Delhi, Lajpat Nagar",
        to: "Gurgaon, DLF Cyber City",
        date: "Oct 15, 2023",
        driver: {
            name: "Arjun Kapoor",
            rating: 4.8,
        },
        price: 220,
        type: "Passenger",
    },
    {
        id: 702,
        from: "Gurgaon, Sector 29",
        to: "Delhi, Dwarka",
        date: "Oct 10, 2023",
        passengers: 3,
        earningsPerPassenger: 150,
        totalEarnings: 450,
        type: "Driver",
    },
];

// Mock data for search results
const mockRides = [
    {
        id: 1,
        from: "Downtown, Central City",
        to: "Airport, Terminal 3",
        date: "Oct 15, 2023",
        time: "08:30 AM",
        price: 25,
        seats: 3,
        car: "Toyota Camry",
        driver: {
            name: "Michael Chen",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 4.8,
        },
    },
    {
        id: 2,
        from: "University Campus",
        to: "Shopping Mall",
        date: "Oct 16, 2023",
        time: "02:15 PM",
        price: 15,
        seats: 2,
        car: "Honda Civic",
        driver: {
            name: "Sarah Johnson",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            rating: 4.5,
        },
    },
    {
        id: 3,
        from: "Tech Park",
        to: "City Center",
        date: "Oct 17, 2023",
        time: "05:45 PM",
        price: 20,
        seats: 4,
        car: "Tesla Model 3",
        driver: {
            name: "Alex Morgan",
            avatar: "https://randomuser.me/api/portraits/men/44.jpg",
            rating: 4.9,
        },
    },
];

const CarpoolDashboard = () => {
    const [searchResults, setSearchResults] = useState<typeof mockRides>([]);
    const [showResults, setShowResults] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated for carpool
        const userDataStr = localStorage.getItem('userData');
        if (!userDataStr) {
            toast.error("Please login to access this page");
            navigate("/carpool-login");
            return;
        }

        const userData = JSON.parse(userDataStr);
        if (!userData.isLoggedIn || userData.type !== "carpool") {
            toast.error("Unauthorized access");
            navigate("/carpool-login");
            return;
        }

        setUserData(userData);
    }, [navigate]);

    const handleSearch = () => {
        setSearchResults(mockRides);
        setShowResults(true);
    };

    const handleCancelRide = (rideId: number) => {
        toast.success("Ride cancelled successfully", {
            description: "All passengers have been notified.",
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
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">Carpool Dashboard</h1>
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
                                                    <h3 className="text-xl font-semibold mb-4">Rides You're Offering</h3>
                                                    <div className="space-y-4">
                                                        {postedRides.map((ride) => (
                                                            <div key={ride.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                                                    <div>
                                                                        <h4 className="text-lg font-semibold">{ride.from} to {ride.to}</h4>
                                                                        <div className="flex flex-wrap gap-x-4 mt-2 text-sm">
                                                                            <div className="flex items-center">
                                                                                <Calendar size={16} className="mr-1 text-muted-foreground" />
                                                                                <span>{ride.date}</span>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <Clock size={16} className="mr-1 text-muted-foreground" />
                                                                                <span>{ride.time}</span>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <Users size={16} className="mr-1 text-muted-foreground" />
                                                                                <span>{ride.availableSeats} seats available</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-4 md:mt-0 text-right">
                                                                        <Badge>{ride.status}</Badge>
                                                                        <div className="font-semibold mt-2">₹{ride.price} per seat</div>
                                                                    </div>
                                                                </div>

                                                                {ride.passengers.length > 0 && (
                                                                    <div className="mb-4">
                                                                        <h5 className="font-medium mb-2">Passengers ({ride.passengers.length})</h5>
                                                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                                                                            {ride.passengers.map((passenger) => (
                                                                                <div key={passenger.id} className="flex justify-between items-center">
                                                                                    <div>{passenger.name}</div>
                                                                                    <div className="text-sm text-muted-foreground">Pickup: {passenger.pickupPoint}</div>
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
                                                                    <Button className="sm:flex-1">
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
                                                    <h3 className="text-xl font-semibold mb-4">Rides You've Booked</h3>
                                                    <div className="space-y-4">
                                                        {bookedRides.map((ride) => (
                                                            <div key={ride.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                                                <div className="flex flex-col md:flex-row justify-between mb-4">
                                                                    <div>
                                                                        <h4 className="text-lg font-semibold">{ride.from} to {ride.to}</h4>
                                                                        <div className="flex flex-wrap gap-x-4 mt-2 text-sm">
                                                                            <div className="flex items-center">
                                                                                <Calendar size={16} className="mr-1 text-muted-foreground" />
                                                                                <span>{ride.date}</span>
                                                                            </div>
                                                                            <div className="flex items-center">
                                                                                <Clock size={16} className="mr-1 text-muted-foreground" />
                                                                                <span>{ride.time}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-2">
                                                                            <div className="text-sm">
                                                                                Driver: {ride.driver.name} ({ride.driver.rating} ★)
                                                                            </div>
                                                                            <div className="text-sm text-muted-foreground">
                                                                                Car: {ride.driver.car}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="mt-4 md:mt-0 text-right">
                                                                        <Badge variant="outline">{ride.status}</Badge>
                                                                        <div className="font-semibold mt-2">₹{ride.price}</div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col sm:flex-row gap-3">
                                                                    <Button
                                                                        variant="outline"
                                                                        className="sm:flex-1"
                                                                    >
                                                                        Cancel Booking
                                                                    </Button>
                                                                    <Button className="sm:flex-1">
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
                                                    <Car size={64} className="mx-auto text-muted-foreground mb-4" />
                                                    <h3 className="text-xl font-semibold mb-2">No Upcoming Rides</h3>
                                                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                                                        You don't have any upcoming rides. Offer a ride or find a ride to get started.
                                                    </p>
                                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                                        <Button>Find a Ride</Button>
                                                        <Button variant="outline">Offer a Ride</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="past">
                                        {completedRides.length > 0 ? (
                                            <div className="space-y-4">
                                                {completedRides.map((ride) => (
                                                    <div key={ride.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                                                        <div className="flex flex-col md:flex-row justify-between">
                                                            <div>
                                                                <h4 className="text-lg font-semibold">{ride.from} to {ride.to}</h4>
                                                                <div className="flex items-center mt-2 text-sm">
                                                                    <Calendar size={16} className="mr-1 text-muted-foreground" />
                                                                    <span>{ride.date}</span>
                                                                </div>

                                                                {ride.type === "Passenger" && (
                                                                    <div className="mt-2">
                                                                        <div className="text-sm">
                                                                            Driver: {ride.driver.name} ({ride.driver.rating} ★)
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
                                                                {ride.type === "Passenger" && (
                                                                    <div className="font-semibold mt-2">Paid: ₹{ride.price}</div>
                                                                )}
                                                                {ride.type === "Driver" && (
                                                                    <div className="font-semibold mt-2">Earned: ₹{ride.totalEarnings}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                                                <Car size={64} className="mx-auto text-muted-foreground mb-4" />
                                                <h3 className="text-xl font-semibold mb-2">No Past Rides</h3>
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

                                {showResults && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <h3 className="text-2xl font-bold mb-6">Available Rides</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            {searchResults.map((ride, index) => (
                                                <RideCard key={ride.id} ride={ride} index={index} />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </TabsContent>

                            <TabsContent value="offerRide">
                                <div className="max-w-2xl mx-auto">
                                    <PostRideForm />
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