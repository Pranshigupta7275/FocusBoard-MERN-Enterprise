# FocusBoard — Frontend

React + TypeScript + Vite frontend for the FocusBoard task management platform.

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit + RTK Query
- React Router
- React Toastify

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Environment

Create a `.env` in `frontend/` if needed:

```env
VITE_API_URL=http://localhost:5000
```

## Integration

The frontend talks to the backend API documented in the root `README.md`.

Auth flows:
- Login/register return JWT tokens
- OTP flow is supported via `/api/auth/request-otp` and `/api/auth/verify-otp`
- Protected routes require an authenticated user
- Admin users are routed to `/admin`
- Regular users are routed to `/dashboard`
