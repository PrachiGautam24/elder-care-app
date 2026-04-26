# Elder Care App

A complete Elder Care Management System with React frontend, Node.js/Express backend, and MongoDB database.

## Features

- **Family Dashboard**: Manage parents, search caregivers, book services
- **Caregiver Dashboard**: Accept jobs, track earnings
- **Admin Panel**: Verify caregivers, view statistics
- **Real-time Care Monitoring**: Live updates during care sessions
- **Payment Integration**: Secure payment processing
- **Rating & Reviews**: Feedback system for caregivers

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)

## Installation

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Database Configuration

✅ **Already configured!** Using MongoDB Atlas (cloud database)

No need to install or run local MongoDB. The connection is set up in `server/.env`

### 3. Environment Variables

Already configured in `server/.env`:
- ✅ `MONGODB_URI` - Connected to MongoDB Atlas
- ✅ `JWT_SECRET` - Secure authentication key
- ✅ `PORT` - Server port (5000)

### 4. Seed Database with Sample Data

```bash
# Add 10 fake nurse/caregiver profiles
npm run seed
```

This creates sample caregivers so you can test the "Find Caregiver" feature immediately.

### 5. Build and Run the Application

```bash
# Build frontend and start server (Production mode - Single Port)
npm run dev
```

The app will run on **http://localhost:5000** (both frontend and backend)

**For Development with Hot Reload:**
```bash
npm run dev:watch
```
This runs frontend (port 3000) and backend (port 5000) separately for development

## Project Structure

```
elder-care-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   └── services/      # API services
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   └── index.js
└── package.json
```

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Parents
- GET `/api/parents` - Get all parents
- POST `/api/parents` - Add parent

### Caregivers
- GET `/api/caregivers` - Get caregivers (with filters)
- GET `/api/caregivers/:id` - Get caregiver details
- POST `/api/caregivers/register` - Register caregiver

### Bookings
- GET `/api/bookings` - Get bookings
- POST `/api/bookings` - Create booking
- PUT `/api/bookings/:id` - Update booking

### Payments
- POST `/api/payments` - Process payment

### Reviews
- GET `/api/reviews/:caregiverId` - Get reviews
- POST `/api/reviews` - Create review

### Admin
- GET `/api/admin/stats` - Get statistics
- PUT `/api/admin/verify/:id` - Verify caregiver

## User Roles

1. **Family**: Book caregivers, manage parents, track care
2. **Caregiver**: Accept jobs, manage schedule, track earnings
3. **Admin**: Verify caregivers, monitor platform

## Design Theme

Clean white theme with:
- Minimalist UI
- High contrast for accessibility
- Large touch-friendly buttons
- Clear typography
- Smooth transitions

## Ports

**Production Mode (Single Port):**
- Everything runs on port 5000 (http://localhost:5000)

**Development Mode (Hot Reload):**
- Frontend: port 3000 (with hot reload)
- Backend: port 5000

**Database:**
- MongoDB Atlas (cloud) - no local setup needed

## Notes

- All caregivers require admin verification before appearing in search
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt
- CORS enabled for local development
