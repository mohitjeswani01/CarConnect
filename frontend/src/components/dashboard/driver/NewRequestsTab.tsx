import React from "react";
import { Car } from "lucide-react";
import RideRequestCard from "./RideRequestCard";
import { RideRequest } from "./driverData";

interface NewRequestsTabProps {
    rideRequests: RideRequest[];
}

const NewRequestsTab = ({ rideRequests }: NewRequestsTabProps) => {
    return (
        <>
            {rideRequests.length > 0 ? (
                <div className="space-y-6">
                    {rideRequests.map((request) => (
                        <RideRequestCard key={request.id} request={request} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
                    <Car size={64} className="mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No New Requests</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        You don't have any new ride requests at the moment. Make sure your availability is set to "Available" to receive requests.
                    </p>
                </div>
            )}
        </>
    );
};

export default NewRequestsTab;