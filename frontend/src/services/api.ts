import axios from 'axios';

import { toast } from 'sonner';

// Define types for your API
interface User {
    id: number;
    name: string;
    email: string;
    role: 'renter' | 'owner' | 'driver';
    type: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

interface ApiError {
    message: string;
    status?: number;
    data?: any;
}

// Create axios instance with base URL for your backend
const API: any = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})<any>; // <-- Explicit generic type

// Add request interceptor with proper typing
API.interceptors.request.use(
    (config: any) => {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const { token } = JSON.parse(userData);
                if (token) {
                    // Type assertion for headers
                    config.headers = config.headers || {};
                    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing userData:', error);
                localStorage.removeItem('userData');
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor with proper typing
API.interceptors.response.use(
    (response: any) => response,
    (error: any) => { // <-- Explicit error type
        const errorData = error.response?.data || { message: error.message };
        console.error('API Error:', errorData);

        let errorMessage = errorData.message || 'Network error';
        const statusCode = error.response?.status || 500;

        toast.error(errorMessage);

        return Promise.reject({
            ...errorData,
            status: statusCode
        });
    }
);

// Auth API
export const authAPI = {
    login: (email: string, password: string) => API.post('/auth/login', { email, password }),

    register: (userData: {
        name: string;
        email: string;
        password: string;
        role: string;
        type?: string;
    }) => API.post('/auth/register', userData),

    getCurrentUser: () => API.get('/auth/current-user')
};
// Car Owner API
export const carOwnerAPI = {
    getCarListings: (): Promise<any> => {
        return API.get('/car-owner/listings');
    },

    addCar: (carData: FormData): Promise<any> => {
        return API.post('/car-owner/cars', carData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    toggleCarAvailability: (carId: number): Promise<any> => {
        return API.patch(`/car-owner/cars/${carId}/toggle-availability`);
    },

    getRentalRecords: (): Promise<any> => {
        return API.get('/car-owner/rental-records');
    },
};

// Driver API
export const driverAPI = {
    getRideRequests: (): Promise<any> => {
        return API.get('/driver/ride-requests');
    },

    getActiveRides: (): Promise<any> => {
        return API.get('/driver/active-rides');
    },

    getRideHistory: (): Promise<any> => {
        return API.get('/driver/ride-history');
    },

    acceptRide: (requestId: number): Promise<any> => {
        return API.post(`/driver/ride-requests/${requestId}/accept`);
    },

    rejectRide: (requestId: number): Promise<any> => {
        return API.post(`/driver/ride-requests/${requestId}/reject`);
    },

    toggleAvailability: (isAvailable: boolean): Promise<any> => {
        return API.patch('/driver/toggle-availability', { isAvailable });
    },
};

// Carpool API
export const carpoolAPI = {
    searchRides: (from: string, to: string, date: string): Promise<any> => {
        return API.get('/carpool/search', { params: { from, to, date } });
    },

    postRide: (rideData: any): Promise<any> => {
        return API.post('/carpool/rides', rideData);
    },

    bookRide: (rideId: string): Promise<any> => {
        return API.post(`/carpool/rides/${rideId}/book`);
    },

    getUserRides: (): Promise<any> => {
        return API.get('/carpool/user-rides');
    },

    getOfferedRides: (): Promise<any> => {
        return API.get('/carpool/offered-rides');
    },

    cancelRideBooking: (rideId: string): Promise<any> => {
        return API.post(`/carpool/rides/${rideId}/cancel`);
    },
};

export default API;