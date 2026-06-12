# 💚 Are You Alive? — Emergency Response Application

An automated safety-check platform that monitors user activity and alerts registered emergency contacts when a user fails to check in. Built as a full-stack web application with a React frontend and a REST API backend.

---

## 🩺 Overview

**Are You Alive?** lets users perform a simple "pulse check" (a single button press) on a regular basis. If a user goes inactive for too long, the system is designed to notify their emergency contacts automatically — turning a missed check-in into a potential life-saving alert.

This repository contains the **frontend** of the application, built with React.

---

## ✨ Key Features

- **Automated Safety-Check System** — A central "I'm Alive" pulse button logs the user's last-active timestamp via a REST API call.
- **Secure Authentication** — JWT-based registration and login flows; tokens are stored client-side and attached to all authenticated requests.
- **Profile Management** — Users maintain a detailed profile: personal info, medical info (allergies, conditions, blood pressure, organ donor status), and up to 5 emergency contacts.
- **Emergency Contact Management** — Add, edit, and remove emergency contacts (name, relationship, phone, email) directly from the Edit Profile page.
- **Real-time Alert Workflow (backend-integrated)** — Designed to integrate with notification services so emergency contacts are alerted if a check-in is missed.
- **Polished, Responsive UI** — Distinct visual themes per page (landing, auth, dashboard, profile) with smooth animations and mobile-friendly layouts.

---

## 🗺️ Application Flow & Routing

The app uses simple hash-based client-side routing (`#/path`).

| Route | Page | Description |
|---|---|---|
| `/` or `/about` | **About** | Landing/marketing page describing the project. Entry point of the app. "Live Demo" button → Home. |
| `/auth` | **Login / Register** | Combined sign-in / sign-up form. |
| `/home` | **Home (Live Demo)** | The "Are You Alive?" pulse-check screen. |
| `/profile` | **Profile** | Read-only view of the logged-in user's profile. |
| `/edit-profile` | **Edit Profile** | Form to create/update personal info, medical info, and emergency contacts. |

### User Journeys

**New User**
1. Lands on the **About** page → clicks **Live Demo** → goes to **Home**.
2. On Home, clicks the green pulse button while logged out → redirected to **Login / Register**.
3. Registers a new account → automatically redirected to **Edit Profile** to complete their details.
4. Saves profile → redirected to **Profile** page.

**Returning User**
1. Lands on **About** → **Home**.
2. Logs in via **Login / Register**.
3. Home now shows **Profile** and **Logout** buttons in the nav, and the pulse button performs a real check-in (`PATCH /api/click`).
4. From **Profile**, the user can click **Edit Profile** to update any information, or **Logout** to end the session.

---

## 📁 Project Structure

```
are-you-alive/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx                 # React entry point
    ├── App.jsx                  # Root component & route table
    ├── context/
    │   └── AuthContext.jsx      # Auth state (token, login, logout)
    ├── components/
    │   └── Toast.jsx            # Toast notification component/hook
    ├── utils/
    │   ├── useRoute.js          # Lightweight hash router hook
    │   └── api.js                # API base URL & fetch helpers
    └── pages/
        ├── AboutPage.jsx         # "/" and "/about" — landing page
        ├── AuthPage.jsx          # "/auth" — login & register
        ├── HomePage.jsx          # "/home" — pulse-check live demo
        ├── ProfilePage.jsx       # "/profile" — view profile
        └── EditProfilePage.jsx   # "/edit-profile" — edit profile form
```

---

## 🔌 API Endpoints (Backend)

The frontend expects a backend running at `http://localhost:5000/api` with the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Create a new account. Returns `{ token }`. |
| `POST` | `/api/login` | Authenticate. Returns `{ token }`. |
| `GET` | `/api/profile` | Fetch the logged-in user's profile (requires `Authorization: Bearer <token>`). |
| `PUT` | `/api/edit-profile` | Update the logged-in user's profile. |
| `PATCH` | `/api/click` | Record a "pulse check" / safety check-in. Returns `{ time }`. |

> 💡 If the backend is unreachable, the **Profile** and **Home** pages gracefully fall back to demo data so the UI remains explorable.

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# run the dev server
npm run dev

# build for production
npm run build
```

The app expects the backend API at `http://localhost:5000/api`. Update `src/utils/api.js` if your backend runs elsewhere.

---

## 🛠️ Tech Stack

- **React** (functional components + hooks)
- **Vite** for development & bundling
- **Vanilla CSS-in-JS** (inline styles) — no external UI library
- **JWT** stored in `localStorage` for session persistence
- **REST API** backend (Node.js / Express assumed)

---

## 📌 Notes

- Authentication state lives in `AuthContext` and is checked on protected pages (`/profile`, `/edit-profile`); unauthenticated users are redirected to `/auth`.
- The pulse-check button on the Home page doubles as the "register/login" call-to-action for logged-out visitors.
- Emergency contacts are capped at 5 per user from the UI side.
