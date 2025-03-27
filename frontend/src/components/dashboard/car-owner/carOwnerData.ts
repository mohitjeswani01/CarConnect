import { CarListing } from "./CarListingCard";
import { RentalRecord } from "./RentalRecordsTable";

// Sample data for car listings
export const carListings: CarListing[] = [
    {
        id: 1,
        model: "Maruti Swift",
        category: "Hatchback",
        available: true,
        price: 800,
        rentalPeriod: "day",
        location: "Delhi, India",
        image: "images/swift.png",
        features: {
            seats: 5,
            transmission: "Manual",
            fuelType: "Petrol",
            mileage: "21 km/l",
        },
    },
    {
        id: 2,
        model: "Hyundai Creta",
        category: "SUV",
        available: false,
        price: 1500,
        rentalPeriod: "day",
        location: "Mumbai, India",
        image: "images/creta.png",
        features: {
            seats: 5,
            transmission: "Automatic",
            fuelType: "Diesel",
            mileage: "18 km/l",
        },
    },
    {
        id: 3,
        model: "Honda City",
        category: "Sedan",
        available: true,
        price: 1200,
        rentalPeriod: "day",
        location: "Bangalore, India",
        image: "images/city.png",
        features: {
            seats: 5,
            transmission: "Automatic",
            fuelType: "Petrol",
            mileage: "19 km/l",
        },
    },
];

export const rentalRecords: RentalRecord[] = [
    {
        id: 101,
        carModel: "Maruti Swift",
        renterId: "R123",
        renterName: "Amit Sharma",
        startDate: "2023-10-15",
        endDate: "2023-10-18",
        status: "Active",
        hasDriver: false,
    },
    {
        id: 102,
        carModel: "Hyundai Creta",
        renterId: "R456",
        renterName: "Priya Patel",
        startDate: "2023-10-20",
        endDate: "2023-10-25",
        status: "Upcoming",
        hasDriver: true,
    },
    {
        id: 103,
        carModel: "Honda City",
        renterId: "R789",
        renterName: "Rajesh Kumar",
        startDate: "2023-10-01",
        endDate: "2023-10-05",
        status: "Completed",
        hasDriver: false,
    },
];