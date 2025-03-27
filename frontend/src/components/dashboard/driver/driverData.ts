export const rideRequests = [
    {
        id: 201,
        renterName: "Aarav Sharma",
        renterPhone: "+91 9876543210",
        carModel: "Maruti Swift",
        category: "Hatchback",
        pickupLocation: "Connaught Place, Delhi",
        startDate: "2023-10-25",
        duration: "3 days",
        status: "Pending",
    },
    {
        id: 202,
        renterName: "Meera Patel",
        renterPhone: "+91 9876123456",
        carModel: "Toyota Innova",
        category: "MPV",
        pickupLocation: "Bandra, Mumbai",
        startDate: "2023-10-30",
        duration: "2 days",
        status: "Pending",
    },
];

// Sample data for active rides
export const activeRides = [
    {
        id: 301,
        renterName: "Vishal Kumar",
        renterPhone: "+91 9811234567",
        carModel: "Honda City",
        category: "Sedan",
        pickupLocation: "MG Road, Bangalore",
        startDate: "2023-10-20",
        endDate: "2023-10-23",
        status: "Active",
    },
];

// Sample data for past rides
export const pastRides = [
    {
        id: 401,
        renterName: "Kavita Singh",
        carModel: "Hyundai Creta",
        category: "SUV",
        location: "Jaipur, Rajasthan",
        date: "2023-10-01 to 2023-10-05",
        earnings: 4000,
        rating: 4.8,
    },
    {
        id: 402,
        renterName: "Mohan Desai",
        carModel: "Maruti Swift",
        category: "Hatchback",
        location: "Pune, Maharashtra",
        date: "2023-09-15 to 2023-09-18",
        earnings: 2400,
        rating: 4.5,
    },
];

// Types for ride data
export interface RideRequest {
    id: number;
    renterName: string;
    renterPhone: string;
    carModel: string;
    category: string;
    pickupLocation: string;
    startDate: string;
    duration: string;
    status: string;
}

export interface ActiveRide {
    id: number;
    renterName: string;
    renterPhone: string;
    carModel: string;
    category: string;
    pickupLocation: string;
    startDate: string;
    endDate: string;
    status: string;
}

export interface PastRide {
    id: number;
    renterName: string;
    carModel: string;
    category: string;
    location: string;
    date: string;
    earnings: number;
    rating: number;
}