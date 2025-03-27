import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface SearchRideFormProps {
    onSearch: () => void;
}

const SearchRideForm = ({ onSearch }: SearchRideFormProps) => {
    const [date, setDate] = React.useState<Date>();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="premium-card p-8"
        >
            <h3 className="text-2xl font-semibold mb-6">Find a Ride</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="search-from">From</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-from"
                                placeholder="Starting location"
                                className="pl-10 premium-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="search-to">To</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search-to"
                                placeholder="Destination"
                                className="pl-10 premium-input"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="search-date">Date</Label>
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

                <Button
                    type="submit"
                    className="w-full h-11 font-medium transition-all hover:shadow-md text-base"
                >
                    <Search className="mr-2 h-4 w-4" />
                    Search Rides
                </Button>
            </form>
        </motion.div>
    );
};

export default SearchRideForm;