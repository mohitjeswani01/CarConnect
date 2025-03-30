import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <div className="space-y-0.5">
        <Label htmlFor="driver-status" className="text-base">
          Driver Status
        </Label>
        <p className="text-sm text-muted-foreground">
          {isAvailable
            ? "You're available to receive ride requests"
            : "You're unavailable to receive ride requests"}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="driver-status"
          checked={isAvailable}
          onCheckedChange={handleAvailabilityChange}
        />
        <Label htmlFor="driver-status" className="font-medium">
          {isAvailable ? "Available" : "Unavailable"}
        </Label>
      </div>
    </div>
  );
};

export default DriverAvailabilityStatus;
