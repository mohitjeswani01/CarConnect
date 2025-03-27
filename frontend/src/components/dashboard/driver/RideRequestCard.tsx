import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, CalendarRange, Phone, MapPin, Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import { RideRequest } from "./driverData";
import { toast } from "sonner";

interface RideRequestCardProps {
    request: RideRequest;
}

const RideRequestCard = ({ request }: RideRequestCardProps) => {
    const handleAcceptRequest = (requestId: number) => {
        toast.success("Ride request accepted", {
            description: "The renter has been notified of your acceptance.",
        });
    };

    const handleRejectRequest = (requestId: number) => {
        toast.success("Ride request rejected", {
            description: "The request has been removed from your list.",
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold">{request.renterName}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Phone size={14} className="mr-1" />
                        <span>{request.renterPhone}</span>
                    </div>
                </div>
                <Badge className="mt-2 md:mt-0">New Request</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <div className="flex items-center mb-2">
                        <Car size={18} className="mr-2 text-muted-foreground" />
                        <span className="font-medium">{request.carModel}</span>
                        <span className="text-sm text-muted-foreground ml-2">({request.category})</span>
                    </div>
                    <div className="flex items-center mb-2">
                        <MapPin size={18} className="mr-2 text-muted-foreground" />
                        <span>{request.pickupLocation}</span>
                    </div>
                </div>
                <div>
                    <div className="flex items-center mb-2">
                        <CalendarRange size={18} className="mr-2 text-muted-foreground" />
                        <span>Start: {request.startDate}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock size={18} className="mr-2 text-muted-foreground" />
                        <span>Duration: {request.duration}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button
                    className="sm:flex-1 flex items-center justify-center"
                    onClick={() => handleAcceptRequest(request.id)}
                >
                    <ThumbsUp size={16} className="mr-2" />
                    Accept Request
                </Button>
                <Button
                    variant="outline"
                    className="sm:flex-1 flex items-center justify-center"
                    onClick={() => handleRejectRequest(request.id)}
                >
                    <ThumbsDown size={16} className="mr-2" />
                    Reject
                </Button>
            </div>
        </div>
    );
};

export default RideRequestCard;