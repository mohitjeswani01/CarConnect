# CarConnect Backend API

This is the backend API for the CarConnect application, built with Node.js, Express, and MongoDB.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/carconnect
   JWT_SECRET=your_jwt_secret_key_change_in_production
   JWT_EXPIRE=30d
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/current-user` - Get current user (protected)

### Car Owner

- `GET /api/car-owner/listings` - Get car listings for owner
- `POST /api/car-owner/cars` - Add new car
- `GET /api/car-owner/cars/:id` - Get single car
- `PUT /api/car-owner/cars/:id` - Update car
- `DELETE /api/car-owner/cars/:id` - Delete car
- `PATCH /api/car-owner/cars/:id/toggle-availability` - Toggle car availability
- `GET /api/car-owner/rental-records` - Get rental records for owner

### Driver

- `GET /api/driver/ride-requests` - Get ride requests
- `GET /api/driver/active-rides` - Get active rides
- `GET /api/driver/ride-history` - Get ride history
- `POST /api/driver/ride-requests/:id/accept` - Accept ride request
- `POST /api/driver/ride-requests/:id/reject` - Reject ride request
- `PATCH /api/driver/toggle-availability` - Toggle driver availability

### Carpool

- `GET /api/carpool/search` - Search for rides (public)
- `POST /api/carpool/rides` - Post a new ride
- `POST /api/carpool/rides/:id/book` - Book a ride
- `GET /api/carpool/user-rides` - Get user rides (booked by user)
- `GET /api/carpool/offered-rides` - Get offered rides (posted by user)
- `POST /api/carpool/rides/:id/cancel` - Cancel ride booking

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

## File Uploads

Files are uploaded using multer and stored in the `/uploads` directory. Car images are stored in `/uploads/cars`