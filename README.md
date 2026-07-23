# Moccus — AI Interview Platform (MVP)

A full-stack mock interview platform. Configure a role, difficulty, and format, then work through an
8-question AI-driven interview and get a structured, scored feedback report at the end.

## Tech stack

**Frontend:** React 19, Vite, Tailwind CSS, React Router DOM, Axios, React Hook Form + Zod, Framer Motion,
Lucide React, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT auth, bcryptjs, Helmet, CORS

**AI:** Google Gemini API (`gemini-1.5-flash`)

## Project structure

```
ai-interview-platform/
├── client/                # React + Vite frontend
│   ├── src/
│   │   ├── api/           # Axios instance + API helpers
│   │   ├── components/    # Navbar, Footer, Layout, ProtectedRoute, Logo
│   │   ├── context/        # AuthContext (JWT session state)
│   │   ├── pages/          # Landing, Auth, Dashboard, Setup, Interview, Result, History
│   │   └── App.jsx
│   └── .env.example
├── server/                 # Express API
│   └── src/
│       ├── config/         # MongoDB connection
│       ├── models/         # User, Interview (Mongoose schemas)
│       ├── controllers/    # auth + interview business logic
│       ├── routes/         # /api/auth, /api/interviews
│       ├── middleware/     # JWT auth guard, error handler
│       ├── services/       # Gemini AI integration
│       └── utils/          # token signing, Zod validators
├── .env.example
└── README.md
```

## Getting started

### 1. Prerequisites

- Node.js 18+
- A MongoDB Atlas cluster (or local MongoDB instance)
- A Google Gemini API key ([Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Backend setup

```bash
cd server
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY in .env
npm install
npm run dev        # starts on http://localhost:5000
```

### 3. Frontend setup

```bash
cd client
cp .env.example .env
# VITE_API_URL defaults to http://localhost:5000/api
npm install
npm run dev         # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## Environment variables

**server/.env**

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLIENT_URL` | Comma-separated allowed CORS origins |

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

## API overview

### Auth — `/api/auth`

| Method | Path | Description |
|---|---|---|
| POST | `/register` | Create an account (name, email, password) |
| POST | `/login` | Log in with email + password |
| POST | `/guest` | Start a temporary guest session (no history saved) |
| GET | `/me` | Get the current authenticated user (requires JWT) |

### Interviews — `/api/interviews` (all require JWT)

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create an interview: generates 8 questions via Gemini, returns the first question |
| POST | `/:id/answer` | Submit an answer; returns the next question, or the final result if it was the last question |
| GET | `/:id` | Fetch a single interview (used by the result page) |
| GET | `/` | List completed interviews for the logged-in user (history) |

Guest accounts can complete interviews and see their result, but the interview document is deleted
immediately after scoring — guests have no persisted history.

## Deployment

**Frontend → Vercel**

1. Import the `client/` directory as the project root.
2. Build command: `npm run build`, output directory: `dist`.
3. Set `VITE_API_URL` to your deployed backend URL (e.g. `https://your-api.onrender.com/api`).

**Backend → Render**

1. Create a new Web Service pointing at the `server/` directory.
2. Build command: `npm install`, start command: `npm start`.
3. Add the environment variables from `server/.env.example` in the Render dashboard.
4. Set `CLIENT_URL` to your deployed Vercel domain.

## Notes on scope (Version 1)

This MVP intentionally does **not** include: voice interviews, an in-browser code editor, resume upload,
an admin panel, or payments. These are natural follow-ups for a v2.
