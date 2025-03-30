import React from "react";
import { Button } from "@/components/ui/button";
import { BadgeIndianRupee, Calendar, MapPin, Phone, User } from "lucide-react";
import { ActiveRide } from "./driverData";

interface ActiveRideCardProps {
  ride: ActiveRide;
  onComplete: (rideId: string) => void;
}

const ActiveRideCard = ({ ride, onComplete }: ActiveRideCardProps) => {
  const handleCompleteRide = () => {
    onComplete(ride.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{ride.carModel}</h3>
          <div className="flex items-center text-green-600">
            <BadgeIndianRupee className="h-4 w-4 mr-1" />
            <span className="font-semibold">₹{ride.earnings}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{ride.renterName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{ride.renterPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{ride.pickupLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {ride.startDate} - {ride.endDate}
            </span>
          </div>
        </div>

        <div className="mt-2">
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Status: {ride.status}
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Button onClick={handleCompleteRide}>Complete Ride</Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveRideCard;
