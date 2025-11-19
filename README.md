# Todo_FullStack_Project

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#)
[![Node.js CI](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)](#)

## About This Project

Todo_FullStack_Project is a concise full‑stack example demonstrating secure user authentication and account management for a Todo-style app. It combines a React + Vite frontend with a Node.js + Express backend and MongoDB (via Mongoose). Key auth flows implemented:

- Access + refresh JWTs
- Email verification on registration
- Password reset via email links
- Secure password hashing with `bcryptjs`

Frontend includes: Registration, Login, Verify Email, Forgot Password, Reset Password. The project is organized so you can add Todo CRUD endpoints and UI quickly.

## Table of Contents

- About This Project
- Tech Stack
- Features
- Quick Start
- Example `.env`
- API Examples
- Project Structure
- Notes

## Tech Stack

- Frontend: React, Vite, React Router, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express, Mongoose (MongoDB), JWT, `bcryptjs`, `nodemailer`

## Features

- User registration with email verification
- Login with short-lived access token + refresh token stored in an HTTP-only cookie
- Forgot password / reset password via email link
- Password hashing with `bcryptjs`
- Frontend state management with Redux Toolkit and sample `authApi` integration

## Quick Start

Follow these steps in PowerShell (Windows):

### 1) Backend

- Create a `.env` file in the `backend/` folder (see example below).
- Install dependencies and start the server:

```powershell
cd backend
npm install
npm start
```

The backend listens on port `8000` by default.

### 2) Frontend

Install dependencies and start the Vite dev server:

```powershell
cd frontend
npm install
npm run dev
```

The frontend typically runs at `http://localhost:5173`.

## Example `.env` (backend)

Create `backend/.env` with values appropriate for your environment:

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.example.mongodb.net/todo_db
ACCESS_TOKEN_SECRET=your_access_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-email-password-or-app-password
CLINT_URL=http://localhost:5173
```

Note: this repo uses the variable name `CLINT_URL` when building links. You can rename it to `CLIENT_URL` in code if you prefer; just update the backend code accordingly.

## API Examples (quick)

1) Register (POST `/api/auth/register`)

```bash
curl -X POST http://localhost:8000/api/auth/register \
	-H "Content-Type: application/json" \
	-d '{"username":"alice","email":"alice@example.com","password":"P@ssw0rd"}'
```

2) Login (POST `/api/auth/login`)

```bash
curl -X POST http://localhost:8000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"alice@example.com","password":"P@ssw0rd"}'
```

See the `backend/controller/authController.js` for full route behavior (email verification, refresh token cookie settings, password reset flow).

## Project Structure (high level)

- `backend/` — Express server; routes in `routes/`, controllers in `controller/`, models in `model/`, DB config in `config/`
- `frontend/` — Vite + React app; store in `src/app`, auth features in `src/features/auth`, pages in `src/pages`

## Notes & Next Steps

- The `CLINT_URL` variable is used by the backend to create verification and reset links — ensure it points to your frontend base URL.
- This repository focuses on authentication; adding a `Todo` model, endpoints, and a simple CRUD UI in the frontend is a recommended next step.
- If you want, I can:
	- Add example Postman collection or more cURL examples
	- Scaffold a minimal `Todo` model + endpoints and wire a basic frontend page
	- Replace `CLINT_URL` with `CLIENT_URL` across the backend code and README

---

Updated README to improve clarity, structure, and examples.

