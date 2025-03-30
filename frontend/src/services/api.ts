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
  getCarListings: (): Promise<any> => {
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

  getDashboardStats: (): Promise<any> => {
    return API.get("/driver/stats");
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
