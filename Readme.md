# FocusBoard — MERN Task Management API

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-4.x-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)
![JWT](https://img.shields.io/badge/JWT-Auth-orange)

> A production-grade, secure REST API for task management with role-based access control, OTP authentication, and an optional admin panel.

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Admin Account Setup](#admin-account-setup)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Security](#security)
- [Error Handling](#error-handling)
- [Frontend Integration](#frontend-integration)
- [Testing & Postman](#testing--postman)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

FocusBoard is a full-stack task management platform built with the MERN stack. It provides secure, role-aware task CRUD operations, passwordless OTP authentication, and an admin dashboard for user and system oversight.

The backend is designed as a clean, layered REST API with explicit separation of concerns: routes, controllers, services, models, middleware, and utilities.

---

## Key Features

### Authentication & Authorization
- User registration with forced role assignment (`role = "user"`)
- Email/password login with JWT issuance
- Passwordless OTP authentication flow
- HttpOnly cookie + Bearer token dual auth support
- Protected routes with role-based access control (`user`, `admin`)

### Task Management
- Full CRUD for tasks with strict ownership enforcement
- Admin exception for system-wide task visibility
- Search by title/description with safely escaped regex
- Filter by status and priority
- Pagination with configurable limits
- Task assignment endpoint (admin only)

### Admin Panel
- Dashboard statistics
- User listing and management
- System-wide task overview
- Controlled admin account creation (no public admin registration)

### Enterprise Patterns
- Centralized error handling middleware
- Input validation and sanitization
- No mass assignment via explicit field allow-lists
- No sensitive information leakage in responses
- Password hashing via bcrypt model hooks
- Environment-based configuration

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT (JSON Web Tokens) |
| Password Hashing | bcrypt |
| Email/OTP | Nodemailer + custom OTP service |
| Validation | Mongoose schema validators, custom API errors |
| Process Management | Concurrently (dev) |

---

## Architecture

```
backend/
├── config/          # Database connection
├── controllers/     # Request handlers / route logic
├── middleware/      # Auth, role, error middleware
├── models/          # Mongoose schemas
├── routes/          # Express route definitions
├── services/        # Business logic, email, JWT, OTP
├── utils/           # ApiResponse, ApiError, asyncHandler
└── index.js         # App entry point, CORS, middleware mount
```

**Design Principles:**
- Controllers handle HTTP concerns only; business logic lives in services
- Middleware enforces auth, roles, and centralized error shaping
- Responses use a consistent `ApiResponse` wrapper
- Errors use a custom `ApiError` class with appropriate HTTP status codes

---

## Project Structure

```
FocusBoard-MERN-Enterprise/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── adminMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   └── Otp.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── adminRoutes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── email.service.js
│   │   ├── jwt.service.js
│   │   └── otp.service.js
│   ├── utils/
│   │   ├── ApiResponse.js
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   ├── scripts/
│   │   └── createAdmin.js
│   ├── .env
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── slices/
│   │   └── ...
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)
- SMTP credentials (for OTP emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/FocusBoard-MERN-Enterprise.git
cd FocusBoard-MERN-Enterprise

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies (optional)
cd ../frontend
npm install
```

### Running the Application

```bash
# Development (backend only)
cd backend
npm run dev

# Development (frontend only)
cd frontend
npm run dev

# Frontend runs on http://localhost:5173
# Backend runs on http://localhost:5000
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/focusboard

# JWT
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# SMTP (for OTP emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# From email
FROM_NAME=FocusBoard
FROM_EMAIL=noreply@focusboard.app

# Admin Development Account (DO NOT commit real credentials)
ADMIN_NAME=FocusBoard Admin
ADMIN_USERNAME=focusboard_admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
```

> **Security Note:** Never commit `.env` to version control. Use `.env.example` for placeholders.

---

## Database Setup

### MongoDB Connection

The application connects to MongoDB via Mongoose. Update `MONGO_URI` in `.env`:

- **Local MongoDB:** `mongodb://localhost:27017/focusboard`
- **MongoDB Atlas:** `mongodb+srv://<user>:<password>@cluster.mongodb.net/focusboard`

### Seeding the Admin

Create the initial admin account using the controlled script:

```bash
cd backend
node scripts/createAdmin.js
```

This script:
- Reads admin credentials from environment variables
- Creates an admin user with `role: "admin"`
- Is idempotent (will not create duplicates if admin already exists)
- Never exposes or logs the admin password

### Creating Users

Register users via the public API:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

> **Important:** The backend always assigns `role: "user"` to public registrations. Role escalation via the client is ignored.

---

## Admin Account Setup

Admin accounts are created exclusively through `scripts/createAdmin.js`:

```bash
ADMIN_NAME="FocusBoard Admin" \
ADMIN_USERNAME="focusboard_admin" \
ADMIN_EMAIL="admin@example.com" \
ADMIN_PASSWORD="change-me" \
node scripts/createAdmin.js
```

There is **no public API endpoint** for creating admin accounts. This ensures role integrity.

---

## API Reference

Base URL: `http://localhost:5000`

All protected routes require authentication via:
- `Authorization: Bearer <JWT_TOKEN>` header, or
- HttpOnly cookie

### Response Format

**Success:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

**Error:**
```json
{
  "statusCode": 400,
  "message": "Error description",
  "success": false
}
```

---

### 1. Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully",
  "success": true
}
```

---

#### Login
```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

---

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "User logged out successfully",
  "success": true
}
```

---

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  },
  "success": true
}
```

---

#### Request OTP
```http
POST /api/auth/request-otp
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "message": "OTP sent to email",
  "success": true
}
```

---

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "OTP verified successfully",
  "success": true
}
```

---

### 2. Tasks (`/api/tasks`)

All task routes require authentication.

#### Get Tasks
```http
GET /api/tasks?search=api&status=Pending&priority=High&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Case-insensitive search in title/description |
| `status` | string | `Pending`, `In Progress`, `Completed` |
| `priority` | string | `Low`, `Medium`, `High` |
| `page` | number | Page number (default: 1, must be ≥ 1) |
| `limit` | number | Items per page (default: 10, max: 100) |

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "64def456...",
      "title": "Build REST API",
      "description": "Complete task management endpoints",
      "status": "In Progress",
      "priority": "High",
      "dueDate": "2026-10-15T00:00:00.000Z",
      "createdBy": "64abc123...",
      "assignedTo": null,
      "createdAt": "2026-10-07T06:00:00.000Z",
      "updatedAt": "2026-10-07T06:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalCount": 24,
    "totalPages": 3
  },
  "success": true
}
```

---

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Build REST API",
  "description": "Complete task management endpoints",
  "status": "In Progress",
  "priority": "High",
  "dueDate": "2026-10-15"
}
```

**Response (201 Created):**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "64def456...",
    "title": "Build REST API",
    "description": "Complete task management endpoints",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "createdBy": "64abc123...",
    "assignedTo": null,
    "createdAt": "2026-10-07T06:00:00.000Z",
    "updatedAt": "2026-10-07T06:00:00.000Z"
  },
  "message": "Task created successfully",
  "success": true
}
```

---

#### Get Task by ID
```http
GET /api/tasks/64def456...
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64def456...",
    "title": "Build REST API",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "createdBy": "64abc123...",
    "assignedTo": null,
    "createdAt": "2026-10-07T06:00:00.000Z",
    "updatedAt": "2026-10-07T06:00:00.000Z"
  },
  "success": true
}
```

---

#### Update Task
```http
PUT /api/tasks/64def456...
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (all fields optional):**
```json
{
  "title": "Build and Test REST API",
  "status": "Completed",
  "priority": "Medium"
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64def456...",
    "title": "Build and Test REST API",
    "status": "Completed",
    "priority": "Medium",
    "dueDate": "2026-10-15T00:00:00.000Z",
    "createdBy": "64abc123...",
    "assignedTo": null,
    "createdAt": "2026-10-07T06:00:00.000Z",
    "updatedAt": "2026-10-08T10:00:00.000Z"
  },
  "message": "Task updated successfully",
  "success": true
}
```

---

#### Delete Task
```http
DELETE /api/tasks/64def456...
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "id": "64def456..."
  },
  "message": "Task deleted successfully",
  "success": true
}
```

---

#### Assign Task (Admin Only)
```http
PUT /api/tasks/64def456.../assign
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "userId": "64abc123..."
}
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64def456...",
    "title": "Build REST API",
    "createdBy": "64abc123...",
    "assignedTo": "64abc123..."
  },
  "message": "Task assigned successfully",
  "success": true
}
```

---

### 3. User Routes (`/api/user`)

#### Get User Dashboard
```http
GET /api/user/dashboard
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User Dashboard",
  "user": {
    "_id": "64abc123...",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### 4. Admin Routes (`/api/admin`)

All admin routes require `Authorization: Bearer <admin_token>`.

#### Admin Stats
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "stats": {
    "totalUsers": 12,
    "totalTasks": 48,
    "completedTasks": 20,
    "pendingTasks": 15
  }
}
```

---

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "64abc123...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    }
  ],
  "success": true
}
```

---

### 5. Health & Root

#### API Health Check
```http
GET /api/health
```

**Response (200 OK):**
```json
{
  "status": "OK"
}
```

---

## Authentication

FocusBoard supports two authentication methods:

### 1. Bearer Token (Recommended for APIs/Postman)
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. HttpOnly Cookie
Automatically handled by browsers when using the frontend.

### OTP Flow
1. Request OTP: `POST /api/auth/request-otp` with `{ "email": "user@example.com" }`
2. Receive OTP via email
3. Verify OTP: `POST /api/auth/verify-otp` with `{ "email": "...", "otp": "123456" }`
4. Receive JWT token in response
5. Use token for subsequent requests

---

## Security

- **Passwords:** Hashed with bcrypt before storage (model pre-save hook)
- **JWT:** Signed with secret, expires per `JWT_EXPIRE`
- **Role Enforcement:** Backend assigns `role: "user"` on all public registrations
- **Admin Creation:** Restricted to `scripts/createAdmin.js` with environment variables
- **Mass Assignment:** Prevented via explicit field allow-lists in controllers
- **Sensitive Data:** Passwords stripped from all user responses via Mongoose `.select("-password")`
- **Input Validation:** Mongoose schema validators + custom error handling
- **CORS:** Configured for specific origins with credentials support
- **Error Messages:** No stack traces or sensitive details exposed in production

---

## Error Handling

All errors follow a consistent format:

**400 Bad Request — Validation Error**
```json
{
  "statusCode": 400,
  "message": "Invalid status",
  "success": false
}
```

**401 Unauthorized**
```json
{
  "statusCode": 401,
  "message": "Not authorized to access this route",
  "success": false
}
```

**403 Forbidden**
```json
{
  "statusCode": 403,
  "message": "Admin access required",
  "success": false
}
```

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Task not found",
  "success": false
}
```

**500 Server Error**
```json
{
  "statusCode": 500,
  "message": "Server Error",
  "success": false
}
```

---

## Frontend Integration

The frontend (React + TypeScript + Vite + Tailwind CSS + Redux Toolkit) is located in the `frontend/` directory.

**Key Features:**
- Protected routes with role-based redirection
- Dashboard with task statistics, search, filters, and pagination
- Create/Edit task modal with validation
- Admin panel with user management and system stats
- Responsive design (mobile-first)
- OTP-based passwordless login

**Setup:**
```bash
cd frontend
npm install
npm run dev
```

---

## Testing & Postman

A Postman collection is recommended for API verification. Key test flows:

### Test 1: Normal Registration
```http
POST /api/auth/register
Body: { "name": "Test User", "username": "testuser", "email": "test@example.com", "password": "Test1234" }
Expected: 201, role = "user"
```

### Test 2: Registration with Role Escalation Attempt
```http
POST /api/auth/register
Body: { "name": "Hacker", "username": "hacker", "email": "hack@example.com", "password": "Test1234", "role": "admin" }
Expected: 201, role = "user" (ignored)
```

### Test 3: Admin Creation
```bash
cd backend
node scripts/createAdmin.js
```
Expected: Admin created with `role: "admin"`

### Test 4: Admin Login
```http
POST /api/auth/login
Body: { "email": "admin@example.com", "password": "change-me" }
Expected: 200, role = "admin"
```

### Test 5: Normal User Login
```http
POST /api/auth/login
Body: { "email": "test@example.com", "password": "Test1234" }
Expected: 200, role = "user"
```

### Test 6: User Accessing Admin API
```http
GET /api/admin/stats
Authorization: Bearer <user_token>
Expected: 403
```

### Test 7: No Token Accessing Protected Route
```http
GET /api/tasks
Expected: 401
```

### Test 8: Admin Accessing Admin API
```http
GET /api/admin/stats
Authorization: Bearer <admin_token>
Expected: 200
```

### Test 9: Logout Clears State
```http
POST /api/auth/logout
Authorization: Bearer <token>
Expected: 200, token invalidated
```

### Test 10: Task Ownership
```http
GET /api/tasks/{other_user_task_id}
Authorization: Bearer <user_token>
Expected: 404
```

---

## Git & GitHub

### Branch Strategy

- `main` — production-ready code
- `backend-assignment` — backend development branch
- Feature branches for isolated work

### Recommended Workflow

```bash
# Create a feature branch
git checkout -b feature/task-api

# Stage and commit
git add .
git commit -m "feat: add task CRUD endpoints"

# Push to remote
git push origin feature/task-api

# Create Pull Request on GitHub
```

### Commit Convention

- `feat:` — new features
- `fix:` — bug fixes
- `docs:` — documentation changes
- `refactor:` — code refactoring
- `test:` — test additions/changes
- `chore:` — maintenance tasks

### Safety Rules

- Never commit `.env` files
- Never commit real JWTs, passwords, or SMTP credentials
- Use `.env.example` for placeholders only
- Review `git diff` and `git status` before committing
- Do not force push to shared branches

---

## Deployment


### Backend (Render / Railway / Fly.io)
1. Set all environment variables in hosting dashboard
2. Ensure `MONGO_URI` points to production database (e.g., MongoDB Atlas)
3. Set `NODE_ENV=production`
4. Run `npm install --production`
5. Start with `npm start`

### Frontend (Vercel / Netlify)
1. Build: `npm run build`
2. Set `VITE_API_URL` to production backend URL
3. Deploy `dist/` folder

---

## License

This project is created for educational and assignment purposes.

---

## Author

FocusBoard MERN Enterprise — Built with Node.js, Express, MongoDB, React, and TypeScript.
