import React from "react";
import { Button } from "@/components/ui/button";
import { BadgeIndianRupee, Calendar, MapPin, Phone, User } from "lucide-react";
import { RideRequest } from "./driverData";

interface RideRequestCardProps {
  request: RideRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const RideRequestCard = ({
  request,
  onAccept,
  onReject,
}: RideRequestCardProps) => {
  const handleAcceptRequest = () => {
    onAccept(request.id);
  };

  const handleRejectRequest = () => {
    onReject(request.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold">{request.carModel}</h3>
          <div className="flex items-center text-green-600">
            <BadgeIndianRupee className="h-4 w-4 mr-1" />
            <span className="font-semibold">₹{request.estimatedEarnings}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{request.renterName}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{request.renterPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{request.pickupLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {request.startDate} - {request.endDate}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button variant="outline" onClick={handleRejectRequest}>
            Reject
          </Button>
          <Button onClick={handleAcceptRequest}>Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default RideRequestCard;
