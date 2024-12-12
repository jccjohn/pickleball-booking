# Pickleball Court Booking System

A modern web application for managing pickleball court reservations.

## Features

- User registration and authentication
- Real-time court availability display
- Secure booking management
- Admin dashboard for court management
- JWT-based authentication
- Double booking prevention

## Tech Stack

- Backend: Node.js with Express
- Database: SQLite
- Frontend: React
- Authentication: JWT, bcrypt
- API: RESTful architecture

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Set up environment variables
4. Start the backend server:
   ```bash
   cd backend && npm start
   ```
5. Start the frontend development server:
   ```bash
   cd frontend && npm start
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
JWT_SECRET=your_jwt_secret
```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Booking Endpoints
- GET /api/courts - Get all courts
- GET /api/courts/availability - Get court availability
- POST /api/bookings - Create a new booking
- GET /api/bookings/user - Get user's bookings
