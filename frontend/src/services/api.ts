import axios from "axios";
import { toast } from "sonner";

// Create base API instance with common config
export const API = axios.create({
  baseURL: "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
API.interceptors.request.use((config) => {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const { token } = JSON.parse(userData);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor for debugging
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "Network error");
    return Promise.reject(error);
  }
);

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
  getCarListings: async (): Promise<any> => {
    return API.get("/car-owner/listings");
  },

  addCar: async (carData: FormData) => {
    console.log("API call - addCar form data:");
    for (let [key, value] of carData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const userData = localStorage.getItem("userData");
    const headers: any = {};

    if (userData) {
      const { token } = JSON.parse(userData);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

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

  toggleCarAvailability: async (carId: string): Promise<any> => {
    return API.patch(`/car-owner/cars/${carId}/toggle-availability`);
  },

  getRentalRecords: async (): Promise<any> => {
    return API.get("/car-owner/rental-records");
  },

  updateCar: async (carId: string, carData: FormData): Promise<any> => {
    return API.put(`/car-owner/cars/${carId}`, carData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteCar: async (carId: string): Promise<any> => {
    return API.delete(`/car-owner/cars/${carId}`);
  },

  getCarDetails: async (carId: string): Promise<any> => {
    return API.get(`/car-owner/cars/${carId}`);
  },
};

// Driver API
export const driverAPI = {
  getDriverProfile: async (): Promise<any> => {
    return API.get("/driver/profile");
  },

  getRideRequests: async (): Promise<any> => {
    return API.get("/driver/ride-requests");
  },

  getActiveRides: async (): Promise<any> => {
    return API.get("/driver/active-rides");
  },

  getRideHistory: async (): Promise<any> => {
    return API.get("/driver/ride-history");
  },

  acceptRide: async (requestId: string): Promise<any> => {
    return API.post(`/driver/ride-requests/${requestId}/accept`);
  },

  rejectRide: async (requestId: string): Promise<any> => {
    return API.post(`/driver/ride-requests/${requestId}/reject`);
  },

  toggleAvailability: async (isAvailable: boolean): Promise<any> => {
    return API.patch("/driver/toggle-availability", { isAvailable });
  },

  endRide: async (rideId: string): Promise<any> => {
    return API.post(`/driver/rides/${rideId}/complete`);
  },

  getNotifications: async (): Promise<any> => {
    return API.get("/driver/notifications");
  },

  markNotificationAsRead: async (notificationId: string): Promise<any> => {
    return API.patch(`/driver/notifications/${notificationId}`);
  },

  createUpdateProfile: async (profileData: any): Promise<any> => {
    return API.post("/driver/profile", profileData);
  },

  getDashboardStats: async (): Promise<any> => {
    return API.get("/driver/stats");
  },
};

// Car Renter API
export const carRenterAPI = {
  searchCars: async (location?: string, category?: string): Promise<any> => {
    const params = new URLSearchParams();
    if (location) params.append("location", location);
    if (category) params.append("category", category);

    return API.get(`/car-renter/search?${params.toString()}`);
  },

  getBookings: async (): Promise<any> => {
    return API.get("/car-renter/bookings");
  },

  bookCar: async (carId: string, bookingData: any): Promise<any> => {
    return API.post(`/car-renter/cars/${carId}/book`, bookingData);
  },

  cancelBooking: async (bookingId: string): Promise<any> => {
    return API.post(`/car-renter/bookings/${bookingId}/cancel`);
  },

  extendBooking: async (bookingId: string, extendData: any): Promise<any> => {
    return API.post(`/car-renter/bookings/${bookingId}/extend`, extendData);
  },

  getNotifications: async (): Promise<any> => {
    return API.get("/car-renter/notifications");
  },

  markNotificationAsRead: async (notificationId: string): Promise<any> => {
    return API.patch(`/car-renter/notifications/${notificationId}`);
  },
};

// Carpool API
export const carpoolAPI = {
  searchRides: async (from: string, to: string, date: string): Promise<any> => {
    return API.get("/carpool/search", { params: { from, to, date } });
  },

  postRide: async (rideData: any): Promise<any> => {
    return API.post("/carpool/postride", rideData);
  },

  bookRide: async (rideId: string): Promise<any> => {
    return API.post(`/carpool/rides/${rideId}/book`);
  },

  getUserRides: async (): Promise<any> => {
    return API.get("/carpool/user-rides");
  },

  getOfferedRides: async (): Promise<any> => {
    return API.get("/carpool/offered-rides");
  },

  cancelRideBooking: async (rideId: string): Promise<any> => {
    return API.post(`/carpool/rides/${rideId}/cancel`);
  },
};

// Notifications API
export const notificationAPI = {
  getUserNotifications: async (userId: string): Promise<any> => {
    return API.get(`/notifications/user/${userId}`);
  },

  markAsRead: async (notificationId: string): Promise<any> => {
    return API.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<any> => {
    return API.patch("/notifications/mark-all-read");
  },

  getUnreadCount: async (): Promise<any> => {
    return API.get("/notifications/unread-count");
  },

  deleteNotification: async (notificationId: string): Promise<any> => {
    return API.delete(`/notifications/${notificationId}`);
  },
};

export default API;
