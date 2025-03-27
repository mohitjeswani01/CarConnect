import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, MapPin, Gauge, Users, Fuel } from "lucide-react";
import { toast } from "sonner";

interface CarFeatures {
    seats: number;
    transmission: string;
    fuelType: string;
    mileage: string;
}

export interface CarListing {
    id: number;
    model: string;
    category: string;
    available: boolean;
    price: number;
    rentalPeriod: string;
    location: string;
    image: string;
    features: CarFeatures;
}

interface CarListingCardProps {
    car: CarListing;
    onToggleAvailability: (carId: number) => void;
}

const CarListingCard: React.FC<CarListingCardProps> = ({ car, onToggleAvailability }) => {
    return (
        <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="relative h-48">
                <img
                    src={car.image}
                    alt={car.model}
                    className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3">
                    <Badge variant={car.available ? "default" : "destructive"}>
                        {car.available ? "Available" : "Rented Out"}
                    </Badge>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold">{car.model}</h3>
                        <p className="text-muted-foreground">{car.category}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-primary">₹{car.price}</div>
                        <div className="text-xs text-muted-foreground">per {car.rentalPeriod}</div>
                    </div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center text-sm mb-2">
                        <MapPin size={16} className="mr-2 text-muted-foreground" />
                        <span>{car.location}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                    <div className="flex items-center">
                        <Users size={16} className="mr-2 text-muted-foreground" />
                        <span>{car.features.seats} Seats</span>
                    </div>
                    <div className="flex items-center">
                        <Car size={16} className="mr-2 text-muted-foreground" />
                        <span>{car.features.transmission}</span>
                    </div>
                    <div className="flex items-center">
                        <Fuel size={16} className="mr-2 text-muted-foreground" />
                        <span>{car.features.fuelType}</span>
                    </div>
                    <div className="flex items-center">
                        <Gauge size={16} className="mr-2 text-muted-foreground" />
                        <span>{car.features.mileage}</span>
                    </div>
                </div>

                <Button
                    onClick={() => onToggleAvailability(car.id)}
                    className="w-full"
                    variant={car.available ? "destructive" : "default"}
                >
                    {car.available ? "Mark as Unavailable" : "Mark as Available"}
                </Button>
            </div>
        </div>
    );
};

export default CarListingCard;