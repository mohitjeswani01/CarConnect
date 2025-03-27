import React from "react";
import { Car } from "lucide-react";
import ActiveRideCard from "./ActiveRideCard";
import { ActiveRide } from "./driverData";

interface ActiveRidesTabProps {
    activeRides: ActiveRide[];
}

const ActiveRidesTab = ({ activeRides }: ActiveRidesTabProps) => {
    return (
        <>
            {activeRides.length > 0 ? (
                <div className="space-y-6">
                    {activeRides.map((ride) => (
                        <ActiveRideCard key={ride.id} ride={ride} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <Car size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Active Rides</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You don't have any active rides at the moment. Accept new ride requests to see them here.
                    </p>
                </div>
            )}
        </>
    );
};

export default ActiveRidesTab;