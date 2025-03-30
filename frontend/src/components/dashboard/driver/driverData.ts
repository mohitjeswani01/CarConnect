import { ReactNode } from "react";

export const activeRides = [
  {
    id: "ride1",
    carModel: "Toyota Innova",
    carMake: "Toyota",
    renterName: "Rahul Verma",
    renterPhone: "+91 76543 21098",
    pickupLocation: "Juhu Beach, Mumbai",
    dropoffLocation: "Pune City Center",
    startDate: "2023-10-18",
    endDate: "2023-10-21",
    status: "Active",
    earnings: 3000,
    bookingId: "booking3",
  },
];

export const pastRides = [
  {
    id: "past1",
    carModel: "Hyundai Verna",
    date: "2023-09-15",
    earnings: 2000,
    rating: 4.5,
    renterName: "Neha Singh",
    location: "Sector 15, Gurgaon",
    endLocation: "Connaught Place, Delhi",
    duration: "2 days",
    bookingId: "booking4",
  },
];

// Type definitions for driver dashboard data

export interface RideRequest {
  id: string;
  carModel: string;
  carMake?: string;
  renterName: string;
  renterPhone: string;
  pickupLocation: string;
  dropoffLocation?: string;
  startDate: string;
  endDate: string;
  estimatedEarnings: number;
  bookingId?: string;
}

export interface ActiveRide {
  id: string;
  carModel: string;
  carMake?: string;
  renterName: string;
  renterPhone: string;
  pickupLocation: string;
  dropoffLocation?: string;
  startDate: string;
  endDate: string;
  status: string;
  earnings: number;
  bookingId?: string;
}

export interface PastRide {
  id: string;
  carModel: string;
  date: string;
  earnings: number;
  rating: number;
  renterName: string;
  location: string;
  endLocation?: string;
  duration: string;
  bookingId?: string;
}

export interface DriverStats {
  totalEarnings: number;
  totalRides: number;
  averageRating: number;
}

export const defaultStats: DriverStats = {
  totalEarnings: 0,
  totalRides: 0,
  averageRating: 0,
};

// Helper functions to map API responses to our interfaces
export const mapToRideRequest = (item: any): RideRequest => {
  return {
    id: item._id || item.id,
    bookingId: item._id || item.id,
    carModel: `${item.car?.make || ""} ${item.car?.model || ""}`,
    renterName: item.renter?.name || "Unknown",
    renterPhone: item.renter?.phone || "N/A",
    pickupLocation: item.car?.location || "Not specified",
    dropoffLocation: "As per booking",
    startDate: new Date(item.startDate).toLocaleDateString(),
    endDate: new Date(item.endDate).toLocaleDateString(),
    estimatedEarnings: item.totalPrice || 0,
  };
};

export const mapToActiveRide = (item: any): ActiveRide => {
  return {
    id: item._id || item.id,
    bookingId: item._id || item.id,
    carModel: `${item.car?.make || ""} ${item.car?.model || ""}`,
    renterName: item.renter?.name || "Unknown",
    renterPhone: item.renter?.phone || "N/A",
    pickupLocation: item.car?.location || "Not specified",
    dropoffLocation: "As per booking",
    startDate: new Date(item.startDate).toLocaleDateString(),
    endDate: new Date(item.endDate).toLocaleDateString(),
    status: item.status,
    earnings: item.totalPrice || 0,
  };
};

export const mapToPastRide = (item: any): PastRide => {
  return {
    id: item._id || item.id,
    bookingId: item._id || item.id,
    carModel: `${item.car?.make || ""} ${item.car?.model || ""}`,
    renterName: item.renter?.name || "Unknown",
    date: new Date(item.endDate).toLocaleDateString(),
    earnings: item.totalPrice || 0,
    rating: item.driverRating || 0,
    location: item.car?.location || "Not specified",
    endLocation: "As per booking",
    duration: `${Math.ceil(
      (new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )} days`,
  };
};
