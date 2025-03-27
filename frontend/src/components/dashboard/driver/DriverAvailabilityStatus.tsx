import React from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DriverAvailabilityStatusProps {
    isAvailable: boolean;
    setIsAvailable: (checked: boolean) => void;
}

const DriverAvailabilityStatus = ({
    isAvailable,
    setIsAvailable,
}: DriverAvailabilityStatusProps) => {
    const handleAvailabilityChange = (checked: boolean) => {
        setIsAvailable(checked);
    };

    return (
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
            <div className="flex items-center space-x-2">
                <Switch
                    id="driver-availability"
                    checked={isAvailable}
                    onCheckedChange={handleAvailabilityChange}
                />
                <Label htmlFor="driver-availability">Available for rides</Label>
            </div>
            <Badge variant={isAvailable ? "success" : "destructive"}>
                {isAvailable ? "Available" : "Unavailable"}
            </Badge>
        </div>
    );
};

export default DriverAvailabilityStatus;