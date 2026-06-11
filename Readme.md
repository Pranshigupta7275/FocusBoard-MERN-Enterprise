FocusBoard: MERN Task Management System
FocusBoard is a high-performance, full-stack productivity platform built on the MERN stack. It provides users with a secure, responsive, and seamless interface to manage personal tasks efficiently.

🚀 Key Features
Hybrid Authentication: Supports both classic password-based login and passwordless OTP authentication for rapid, secure user access.

Persistent State Management: Leverages Redux Toolkit and RTK Query for automated API caching, synchronization, and real-time UI updates.

Secure API Architecture: Implements industry-standard security practices, including JWT-based authentication, HTTP-only cookie storage, and role-based middleware.

Optimized Performance: Built with Vite and TypeScript to ensure a lightweight, fast-loading, and type-safe frontend.

Dynamic CRUD Operations: Enables real-time creation, retrieval, updates, and deletion of tasks with instant feedback.

🛠 Tech Stack
Frontend

Core: React, TypeScript, Vite

State & API: Redux Toolkit, RTK Query

UI/UX: Responsive CSS, React Toastify, React Router

Backend

Core: Node.js, Express

Database: MongoDB, Mongoose ODM

Security: JSON Web Tokens (JWT), bcryptjs

💻 Getting Started
Prerequisites
Node.js (v16+)

npm

MongoDB instance (Local or MongoDB Atlas)

Environment Variables
Create a .env file in the backend/ directory:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
Installation
Clone the repository

Bash
git clone https://github.com/Pranshigupta7275/mern-task-manager.git
cd mern-task-manager
Install backend dependencies

Bash
cd backend
npm install
Install frontend dependencies

Bash
cd ../frontend
npm install
Running the Application
Start the backend server

Bash
cd backend
npm run dev
Start the frontend development server

Bash
cd ../frontend
npm run dev
Frontend: http://localhost:5173

Backend: http://localhost:5000

🏗 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
GET	/api/auth/logout	Logout user
GET	/api/auth/profile	Get current user profile (protected)
GET	/api/tasks	Get all tasks for user (protected)
POST	/api/tasks	Create a new task (protected)
PUT	/api/tasks/:id	Update a task (protected)
DELETE	/api/tasks/:id	Delete a task (protected)
📂 Folder Structure
Plaintext
mern-task-manager/
  backend/
    controllers/
    middleware/
    models/
    routes/
    config/
    .env
    index.js
    package.json
  frontend/
    src/
      api/        # RTK Query API slice definitions
      components/ # Reusable UI components
      context/    # AuthContext provider
      css/        # Component-specific styles
      pages/      # View components
      App.tsx
      main.tsx
    package.json
    vite.config.ts
Built with passion by Pranshi Gupta.