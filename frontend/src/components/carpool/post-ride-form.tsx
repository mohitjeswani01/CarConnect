import React, { useState } from "react";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, Car, Users, DollarSign, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const PostRideForm = () => {
    const [date, setDate] = useState<Date>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="car">Car Model</Label>
                        <div className="relative">
                            <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="car"
                                placeholder="e.g., Toyota Camry"
                                className="pl-10 premium-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="seats">Available Seats</Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="seats"
                                type="number"
                                min="1"
                                max="8"
                                placeholder="Number of available seats"
                                className="pl-10 premium-input"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price per Seat</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Price in $"
                            className="pl-10 premium-input"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <textarea
                        id="notes"
                        placeholder="Any additional information about the ride..."
                        className="w-full rounded-lg border-gray-200 bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 p-3 h-28"
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