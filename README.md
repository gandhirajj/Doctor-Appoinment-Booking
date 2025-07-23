# Doctor Appointment Booking System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for booking doctor appointments.

## Features

- User authentication (Register/Login) for patients and doctors
- Doctor profiles with specializations, experience, and qualifications
- Appointment booking system with date and time selection
- Dashboard for patients to manage their appointments
- Dashboard for doctors to manage their profile and appointments
- Doctor reviews and ratings

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- React Bootstrap for UI components
- Axios for API requests
- React Toastify for notifications
- Date-fns for date manipulation

## Project Structure

```
doctor-appointment/
├── doc/                  # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/   # Reusable components
│       ├── context/      # Context API for state management
│       ├── pages/        # Page components
│       └── App.js        # Main application component
│
└── server/               # Backend Node.js/Express application
    ├── controllers/      # Route controllers
    ├── middleware/       # Custom middleware
    ├── models/           # Mongoose models
    ├── routes/           # API routes
    └── server.js         # Entry point
```

## Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd doc
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React application:
   ```
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor profile (doctor only)
- `PUT /api/doctors/:id` - Update doctor profile (doctor only)
- `POST /api/doctors/:id/reviews` - Add doctor review (patient only)

### Appointments
- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment (patient only)
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## License

This project is licensed under the MIT License.
