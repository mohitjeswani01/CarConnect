export const rideRequests = [
  {
    id: "req1",
    carModel: "Honda City",
    renterName: "Amit Kumar",
    renterPhone: "+91 98765 43210",
    pickupLocation: "Connaught Place, Delhi",
    dropoffLocation: "Sector 62, Noida",
    startDate: "2023-10-20",
    endDate: "2023-10-22",
    estimatedEarnings: 1500,
  },
  {
    id: "req2",
    carModel: "Maruti Swift",
    renterName: "Priya Sharma",
    renterPhone: "+91 87654 32109",
    pickupLocation: "MG Road, Bangalore",
    dropoffLocation: "Electronic City, Bangalore",
    startDate: "2023-10-25",
    endDate: "2023-10-27",
    estimatedEarnings: 1200,
  },
];

export const activeRides = [
  {
    id: "ride1",
    carModel: "Toyota Innova",
    renterName: "Rahul Verma",
    renterPhone: "+91 76543 21098",
    pickupLocation: "Juhu Beach, Mumbai",
    dropoffLocation: "Pune City Center",
    startDate: "2023-10-18",
    endDate: "2023-10-21",
    status: "Active",
    earnings: 3000,
  },
];

export const pastRides = [
  {
    id: "past1",
    carModel: "Hyundai Verna",
    renterName: "Neha Singh",
    date: "2023-09-15",
  },
];

// Types for ride data
export interface RideRequest {
  id: string;
  carModel: string;
  renterName: string;
  renterPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  endDate: string;
  estimatedEarnings: number;
}

export interface ActiveRide {
  id: string;
  carModel: string;
  renterName: string;
  renterPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  startDate: string;
  endDate: string;
  status: string;
  earnings: number;
}

export interface PastRide {
  id: string;
  carModel: string;
  renterName: string;
  date: string;
  earnings?: number;
  rating?: number;
  status?: string;
}
