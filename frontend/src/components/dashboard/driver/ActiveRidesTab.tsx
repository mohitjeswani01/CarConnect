import React from "react";
import { Car } from "lucide-react";
import { ActiveRide } from "./driverData";
import ActiveRideCard from "./ActiveRideCard";

interface ActiveRidesTabProps {
  activeRides: ActiveRide[];
  onComplete: (rideId: string) => void;
}

const ActiveRidesTab = ({ activeRides, onComplete }: ActiveRidesTabProps) => {
  return (
    <>
      {activeRides.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeRides.map((ride) => (
            <ActiveRideCard key={ride.id} ride={ride} onComplete={onComplete} />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 text-center">
          <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Active Rides</h3>
          <p className="text-muted-foreground">
            You don't have any active rides at the moment.
          </p>
        </div>
      )}
    </>
  );
};

export default ActiveRidesTab;
