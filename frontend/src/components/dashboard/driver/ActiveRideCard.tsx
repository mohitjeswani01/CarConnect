import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, CalendarRange, Phone, MapPin } from "lucide-react";
import { ActiveRide } from "./driverData";

interface ActiveRideCardProps {
    ride: ActiveRide;
}

const ActiveRideCard = ({ ride }: ActiveRideCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold">{ride.renterName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Phone size={14} className="mr-1" />
                        <span>{ride.renterPhone}</span>
                    </div>
                </div>
                <Badge variant="default" className="mt-2 md:mt-0">Active Ride</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Car size={18} className="mr-2 text-muted-foreground" />
                        <span className="font-medium">{ride.carModel}</span>
                        <span className="text-sm text-muted-foreground ml-2">({ride.category})</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <MapPin size={18} className="mr-2 text-muted-foreground" />
                        <span>{ride.pickupLocation}</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center mb-2">
                        <CalendarRange size={18} className="mr-2 text-muted-foreground" />
                        <span>{ride.startDate} to {ride.endDate}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button className="sm:flex-1">
                    Call Renter
                </Button>
                <Button variant="outline" className="sm:flex-1">
                    End Ride Early
                </Button>
            </div>
        </div>
    );
};

export default ActiveRideCard;
