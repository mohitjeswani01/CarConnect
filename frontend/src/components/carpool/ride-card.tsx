import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, Car, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface RideCardProps {
    ride: {
        id: number;
        from: string;
        to: string;
        date: string;
        time: string;
        price: number;
        seats: number;
        car: string;
        driver: {
            name: string;
            avatar: string;
            rating: number;
        };
    };
    index: number;
}

const RideCard = ({ ride, index }: RideCardProps) => {
    const handleBookRide = () => {
        toast.success("Ride booked successfully!", {
            description: "The driver has been notified of your booking.",
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="premium-card p-6 hover:shadow-lg transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarImage src={ride.driver.avatar} alt={ride.driver.name} />
                        <AvatarFallback>{ride.driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{ride.driver.name}</p>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill={i < ride.driver.rating ? "#FFD700" : "#E2E8F0"}
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                </svg>
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">{ride.driver.rating.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <Badge variant="outline" className="font-medium">
                    ${ride.price}
                    <span className="text-xs ml-1">per seat</span>
                </Badge>
            </div>

            <div className="flex items-center space-x-3 mb-4">
                <div className="flex-shrink-0 w-6 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="w-0.5 h-10 bg-gray-200 dark:bg-gray-700 my-1"></div>
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                </div>
                <div className="flex-grow">
                    <p className="font-medium">{ride.from}</p>
                    <div className="mt-6"></div>
                    <p className="font-medium">{ride.to}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span className="text-sm">{ride.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="text-sm">{ride.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Car size={16} className="text-muted-foreground" />
                    <span className="text-sm">{ride.car}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span className="text-sm">{ride.seats} seats available</span>
                </div>
            </div>

            <Button
                onClick={handleBookRide}
                className="w-full font-medium transition-all hover:shadow-md"
            >
                Book Ride
                <ArrowRight size={16} className="ml-2" />
            </Button>
        </motion.div>
    );
};

export default RideCard;