import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  Clock,
  Car,
  Users,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const PostRideForm = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    availableSeats: 1,
    pricePerSeat: 0,
    carDetails: "",
    additionalInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "availableSeats" || id === "pricePerSeat"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      date: date || formData.date,
    };
    console.log(submissionData);
    toast.success("Ride posted successfully!", {
      description: "Your ride is now visible to potential passengers.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="premium-card p-8"
    >
      <h3 className="text-2xl font-semibold mb-6">Post a Ride</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="from"
                placeholder="Starting location"
                className="pl-10 premium-input"
                required
                value={formData.from}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="to"
                placeholder="Destination"
                className="pl-10 premium-input"
                required
                value={formData.to}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal premium-input",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                className="pl-10 premium-input"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="carDetails">Car Model</Label>
            <div className="relative">
              <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="carDetails"
                placeholder="e.g., Toyota Camry"
                className="pl-10 premium-input"
                required
                value={formData.carDetails}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="availableSeats">Available Seats</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="availableSeats"
                type="number"
                min="1"
                max="8"
                placeholder="Number of available seats"
                className="pl-10 premium-input"
                required
                value={formData.availableSeats}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerSeat">Price per Seat</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="pricePerSeat"
              type="number"
              min="0"
              step="0.01"
              placeholder="Price in $"
              className="pl-10 premium-input"
              required
              value={formData.pricePerSeat}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Notes</Label>
          <textarea
            id="additionalInfo"
            placeholder="Any additional information about the ride..."
            className="w-full rounded-lg border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 p-3 h-28"
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 font-medium transition-all hover:shadow-md text-base"
        >
          Post Ride
        </Button>
      </form>
    </motion.div>
  );
};

export default PostRideForm;
