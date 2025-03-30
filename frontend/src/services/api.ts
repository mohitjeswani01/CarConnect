import axios from "axios";

import { toast } from "sonner";

// Define types for your API
interface User {
  id: number;
  name: string;
  email: string;
  role: "renter" | "owner" | "driver";
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
  baseURL: "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
})<any>; // <-- Explicit generic type

// Add request interceptor with proper typing
API.interceptors.request.use(
  (config: any) => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const { token } = JSON.parse(userData);
        if (token) {
          // Type assertion for headers
          config.headers = config.headers || {};
          (
            config.headers as Record<string, string>
          ).Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing userData:", error);
        localStorage.removeItem("userData");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Debug interceptor
API.interceptors.request.use((request) => {
  console.log("Request:", request.method, request.url);
  console.log("Headers:", request.headers);
  return request;
});

API.interceptors.response.use(
  (response) => {
    console.log("Response Status:", response.status);
    return response;
  },
  (error) => {
    console.error(
      "API Error Response:",
      error.response?.status,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

// Response interceptor with proper typing
API.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    // <-- Explicit error type
    const errorData = error.response?.data || { message: error.message };
    console.error("API Error:", errorData);

    let errorMessage = errorData.message || "Network error";
    const statusCode = error.response?.status || 500;

    toast.error(errorMessage);

    return Promise.reject({
      ...errorData,
      status: statusCode,
    }) as Promise<any>;
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    API.post("/auth/login", { email, password }),

  register: (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    type?: string;
  }) => API.post("/auth/register", userData),

  getCurrentUser: () => API.get("/auth/current-user"),
};
// Car Owner API
export const carOwnerAPI = {
  getCarListings: (): Promise<any> => {
    return API.get("/car-owner/listings");
  },

  addCar: async (carData: FormData) => {
    // Log the form data for debugging
    console.log("API call - addCar form data:");
    for (let [key, value] of carData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Ensure authentication headers are added but don't override content-type
    const userData = localStorage.getItem("userData");
    const headers: any = {};

    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    // Make the API call with explicit content-type and auth headers
    const res = await axios.post(
      "http://localhost:5050/api/car-owner/cars",
      carData,
      {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res.data);
  },

  toggleCarAvailability: (carId: string): Promise<any> => {
    return API.patch(`/car-owner/cars/${carId}/toggle-availability`);
  },

  getRentalRecords: (): Promise<any> => {
    return API.get("/car-owner/rental-records");
  },

  updateCar: (carId: string, carData: FormData): Promise<any> => {
    return API.put(`/car-owner/cars/${carId}`, carData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCar: (carId: string): Promise<any> => {
    return API.delete(`/car-owner/cars/${carId}`);
  },

  getCarDetails: (carId: string): Promise<any> => {
    return API.get(`/car-owner/cars/${carId}`);
  },
};

// Driver API
export const driverAPI = {
  getDriverProfile: (): Promise<any> => {
    return API.get("/driver/profile");
  },

  getRideRequests: (): Promise<any> => {
    return API.get("/driver/ride-requests");
  },

  getActiveRides: (): Promise<any> => {
    return API.get("/driver/active-rides");
  },

  getRideHistory: (): Promise<any> => {
    return API.get("/driver/ride-history");
  },

  acceptRide: (requestId: string): Promise<any> => {
    return API.post(`/driver/ride-requests/${requestId}/accept`);
  },

  rejectRide: (requestId: string): Promise<any> => {
    return API.post(`/driver/ride-requests/${requestId}/reject`);
  },

  toggleAvailability: (isAvailable: boolean): Promise<any> => {
    return API.patch("/driver/toggle-availability", { isAvailable });
  },

  endRide: (rideId: string): Promise<any> => {
    return API.post(`/driver/rides/${rideId}/complete`);
  },

  getNotifications: (): Promise<any> => {
    return API.get("/driver/notifications");
  },

  markNotificationAsRead: (notificationId: string): Promise<any> => {
    return API.patch(`/driver/notifications/${notificationId}`);
  },

  createUpdateProfile: (profileData: any): Promise<any> => {
    return API.post("/driver/profile", profileData);
  },
};

// Car Renter API
export const carRenterAPI = {
  searchCars: (location?: string, category?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (category) params.append("category", category);

    return API.get(`/car-renter/search?${params.toString()}`);
  },

  getBookings: (): Promise<any> => {
    return API.get("/car-renter/bookings");
  },

  bookCar: (carId: string, bookingData: any): Promise<any> => {
    return API.post(`/car-renter/cars/${carId}/book`, bookingData);
  },

  cancelBooking: (bookingId: string): Promise<any> => {
    return API.post(`/car-renter/bookings/${bookingId}/cancel`);
  },

  extendBooking: (bookingId: string, extendData: any): Promise<any> => {
    return API.post(`/car-renter/bookings/${bookingId}/extend`, extendData);
  },

  getNotifications: (): Promise<any> => {
    return API.get("/car-renter/notifications");
  },

  markNotificationAsRead: (notificationId: string): Promise<any> => {
    return API.patch(`/car-renter/notifications/${notificationId}`);
  },
};

// Carpool API
export const carpoolAPI = {
  searchRides: (from: string, to: string, date: string): Promise<any> => {
    return API.get("/carpool/search", { params: { from, to, date } });
  },

  postRide: (rideData: any): Promise<any> => {
    return API.post("/carpool/rides", rideData);
  },

  bookRide: (rideId: string): Promise<any> => {
    return API.post(`/carpool/rides/${rideId}/book`);
  },

  getUserRides: (): Promise<any> => {
    return API.get("/carpool/user-rides");
  },

  getOfferedRides: (): Promise<any> => {
    return API.get("/carpool/offered-rides");
  },

  cancelRideBooking: (rideId: string): Promise<any> => {
    return API.post(`/carpool/rides/${rideId}/cancel`);
  },
};

// Notifications API
export const notificationAPI = {
  getUserNotifications: (userId: string): Promise<any> => {
    return API.get(`/notifications/user/${userId}`);
  },

  markAsRead: (notificationId: string): Promise<any> => {
    return API.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: (): Promise<any> => {
    return API.patch("/notifications/mark-all-read");
  },

  getUnreadCount: (): Promise<any> => {
    return API.get("/notifications/unread-count");
  },

  deleteNotification: (notificationId: string): Promise<any> => {
    return API.delete(`/notifications/${notificationId}`);
  },
};

export default API;
