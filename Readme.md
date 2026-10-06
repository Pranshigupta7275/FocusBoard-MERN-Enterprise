# FocusBoard | Enterprise-Grade Task Lifecycle Management

**FocusBoard** is a robust, high-availability task management ecosystem engineered with the MERN stack. Designed for performance and scalability, the platform offers a streamlined, type-safe interface for end-to-end task lifecycle management, featuring advanced authentication patterns and high-performance state synchronization.

## 🏗 Engineering Architecture
FocusBoard is built on a decoupled, modular architecture designed for high maintainability and ease of integration.

### The Tech Stack
* **Core:** Node.js, Express.js
* **Frontend:** React 19+ (Vite), TypeScript, Tailwind CSS
* **Data Persistence:** MongoDB, Mongoose ODM
* **State Management:** Redux Toolkit, RTK Query (Optimistic Updates)
* **Security:** JWT-based stateless Auth, HTTP-Only Cookie implementation

---

## 🚀 System Dashboards

| Admin Control Center | User Productivity Workspace |
| :--- | :--- |
| ![Admin Dashboard](assets/admin-dashboard.png) | ![User Dashboard](assets/user-dashboard.png) |
| *Administrative User & Task Oversight* | *Personalized Task Lifecycle Management* |

---

## 🛠 Technical Highlights
* **Advanced Authentication Pipeline:** Hybrid authentication supporting classic credentials and passwordless flows via **HttpOnly cookies** to mitigate XSS/CSRF vectors.
* **Optimized Data Sync:** Leverages **RTK Query** for automated data caching, polling, and cache invalidation, ensuring a responsive user experience.
* **Role-Based Access Control (RBAC):** Middleware-driven API architecture ensuring granular permissions for Admins and Standard Users.
* **Type-Safe Frontend:** Built with **TypeScript** to enforce strict interface definitions for all data models and API interactions.

---

## 📂 Project Structure
```text
FocusBoard/
├── assets/             # Documentation & UI Screenshots
├── backend/            # Express REST API (Controllers, Middleware, Models, Routes)
└── frontend/           # Vite-powered React SPA (RTK Query Services, UI Components)

💻 Getting Started
Prerequisites
Node.js: v16+

Database: MongoDB Atlas

Installation
Clone the repository:

Bash
git clone [https://github.com/Pranshigupta7275/FocusBoard-MERN-Enterprise.git](https://github.com/Pranshigupta7275/FocusBoard-MERN-Enterprise.git)
cd FocusBoard-MERN-Enterprise
Setup Backend:

Bash
cd backend
npm install
# Create a .env file with MONGO_URI, JWT_SECRET, and PORT
npm run dev
Setup Frontend:

Bash
cd ../frontend
npm install
npm run dev
📈 Security & Governance
This platform adheres to industry-standard security protocols:

JWT Integrity: Stateless token verification for all protected routes.

Environment Isolation: Strict handling of secrets via .env configurations.

API Protection: CORS and helmet integration for production-ready security.

👨‍💻 Author
Pranshi Gupta | Full Stack Engineer

Building performant, user-centric software architectures.

GitHub | LinkedIn|pranshigupta705@gmail.com
