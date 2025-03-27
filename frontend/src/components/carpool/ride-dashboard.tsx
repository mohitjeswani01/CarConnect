import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, User, Settings, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import RideCard from "./ride-card";

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
];

const RideDashboard = () => {
    const [activeTab, setActiveTab] = useState("upcoming");

    return (
        <section className="py-10">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="lg:w-1/4"
                    >
                        <div className="premium-card p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <User size={24} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">John Doe</h3>
                                    <p className="text-muted-foreground text-sm">john.doe@example.com</p>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <nav className="space-y-2">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-left"
                                >
                                    <CalendarDays size={18} className="mr-2" />
                                    My Rides
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-left"
                                >
                                    <Bell size={18} className="mr-2" />
                                    Notifications
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-left"
                                >
                                    <Settings size={18} className="mr-2" />
                                    Settings
                                </Button>
                            </nav>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="lg:w-3/4"
                    >
                        <div className="premium-card p-6">
                            <h2 className="text-2xl font-bold mb-6">My Rides</h2>

                            <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
                                <TabsList className="grid grid-cols-3 mb-6">
                                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                                    <TabsTrigger value="offering">Offering</TabsTrigger>
                                    <TabsTrigger value="past">Past</TabsTrigger>
                                </TabsList>

                                <TabsContent value="upcoming" className="space-y-6">
                                    {mockRides.map((ride, index) => (
                                        <RideCard key={ride.id} ride={ride} index={index} />
                                    ))}
                                </TabsContent>

                                <TabsContent value="offering">
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground mb-4">You're not offering any rides at the moment.</p>
                                        <Button>Post a New Ride</Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="past">
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground">No past rides found.</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default RideDashboard;