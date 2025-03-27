import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Car, MapPin, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AddCarFormProps {
    onSubmit: (e: React.FormEvent) => void;
}

const AddCarForm: React.FC<AddCarFormProps> = ({ onSubmit }) => {
    const [availableDate, setAvailableDate] = useState<Date>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(e);
            // Clear form after successful submission
            setAvailableDate(undefined);
            const form = e.target as HTMLFormElement;
            form.reset();
        } catch (error) {
            console.error("Error in form submission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-6">Add a New Car</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="carModel">Car Model</Label>
                        <div className="relative">
                            <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="carModel"
                                name="carModel"
                                placeholder="e.g., Maruti Suzuki Swift"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <select
                            id="category"
                            name="category"
                            className="w-full rounded-md border border-input py-2 px-3 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="hatchback">Hatchback</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="Price per day"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="location"
                                name="location"
                                placeholder="e.g., Delhi, India"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="transmission">Transmission</Label>
                        <select
                            id="transmission"
                            name="transmission"
                            className="w-full rounded-md border border-input py-2 px-3 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="">Select Transmission</option>
                            <option value="manual">Manual</option>
                            <option value="automatic">Automatic</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fuelType">Fuel Type</Label>
                        <select
                            id="fuelType"
                            name="fuelType"
                            className="w-full rounded-md border border-input py-2 px-3 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            required
                        >
                            <option value="">Select Fuel Type</option>
                            <option value="petrol">Petrol</option>
                            <option value="diesel">Diesel</option>
                            <option value="cng">CNG</option>
                            <option value="electric">Electric</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="seats">Number of Seats</Label>
                        <Input
                            id="seats"
                            name="seats"
                            type="number"
                            placeholder="e.g., 5"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="mileage">Mileage (km/l)</Label>
                        <Input
                            id="mileage"
                            name="mileage"
                            placeholder="e.g., 21"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="carImage">Car Image</Label>
                    <Input
                        id="carImage"
                        name="carImage"
                        type="file"
                        accept="image/*"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label>Available From</Label>
                    <input
                        type="hidden"
                        name="availableDate"
                        value={availableDate ? format(availableDate, 'yyyy-MM-dd') : ''}
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !availableDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {availableDate ? format(availableDate, "PPP") : <span>Select a date</span>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={availableDate}
                                onSelect={setAvailableDate}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <Button
                    type="submit"
                    className="w-full h-11 font-medium transition-all hover:shadow-md text-base"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                            Processing...
                        </span>
                    ) : (
                        <>
                            <Plus size={16} className="mr-2" />
                            Add Car to Listings
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default AddCarForm;