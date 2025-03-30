import React from "react";
import { Inbox } from "lucide-react";
import RideRequestCard from "./RideRequestCard";
import { RideRequest } from "./driverData";

interface NewRequestsTabProps {
  rideRequests: RideRequest[];
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const NewRequestsTab = ({
  rideRequests,
  onAccept,
  onReject,
}: NewRequestsTabProps) => {
  return (
    <>
      {rideRequests.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rideRequests.map((request) => (
            <RideRequestCard
              key={request.id}
              request={request}
              onAccept={onAccept}
              onReject={onReject}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-10 text-center">
          <Inbox className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Ride Requests</h3>
          <p className="text-muted-foreground">
            There are currently no new ride requests available. Check back
            later.
          </p>
        </div>
      )}
    </>
  );
};

export default NewRequestsTab;
