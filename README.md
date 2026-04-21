<<<<<<< HEAD
<div align="center">

# 🎓 Campus Skill Exchange Platform

### *A peer-to-peer learning ecosystem for college students*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br/>

> **Stop paying for courses. Start teaching what you know. Learn what you don't.**  
> A full-stack MERN platform where students exchange skills, build trust, and grow together.

<br/>

[🚀 Quick Start](#-quick-start) · [📖 Features](#-features) · [🔐 Admin Panel](#-admin-panel) · [📡 API Docs](#-api-reference) · [🏗️ Architecture](#-architecture)

</div>

---

## 📸 Overview

Campus Skill Exchange is a production-grade peer learning platform with:
- A **smart bidirectional matching engine** that pairs students with complementary skills
- A **trust score system** that gamifies reliability and session completion
- A **full admin control panel** for platform governance and analytics
- Beautiful **light/dark mode** UI with toast notifications and glassmorphism design

---

## ✨ Features

### 👥 For Students
| Feature | Description |
|---|---|
| 🔐 Auth | Register/Login with JWT-secured sessions |
| 🧠 Smart Matching | Algorithm pairs you with students who teach what you want to learn AND learn what you can teach |
| 📅 Session Booking | Request, accept, reject, and complete learning sessions |
| ⭐ Ratings | Rate peers after sessions to build community trust |
| 🔒 Change Password | Secure account management |
| 🌙 Dark/Light Mode | Persistent theme preference |

### 🛡️ For Admins
| Feature | Description |
|---|---|
| 📊 Analytics Dashboard | Total users, active sessions, top skills chart, average rating |
| 👤 User Management | View, edit, block, ban, or delete any student |
| 📅 Session Management | Filter by status, force-complete, or cancel sessions |
| ⚙️ System Settings | Toggle registration, session booking, and AI features live |
| 🔑 Role-Based Access | JWT middleware strictly enforces admin-only routes |

### 🤖 AI Features (Optional)
- Smart skill learning roadmap via **OpenAI GPT-3.5** (`POST /api/match/roadmap`)
- Graceful fallback to static rule-based roadmap if key is missing

---

## 🚀 Quick Start

### Prerequisites
- [Node.js v16+](https://nodejs.org/)
- [MongoDB v6+](https://www.mongodb.com/try/download/community) running locally

### 1️⃣ Clone & Install

```bash
git clone https://github.com/your-username/campus-skill-exchange.git
cd campus-skill-exchange

# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 2️⃣ Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/campus-skill-exchange
JWT_SECRET=super_secret_campus_key_2026
JWT_EXPIRE=30d

# Optional — AI roadmaps
OPENAI_API_KEY=sk-your-key-here

# Admin credentials
ADMIN_USERNAME=campus_admin
ADMIN_PASSWORD=Skill@2026
```

### 3️⃣ Start MongoDB

```bash
# Windows (adjust path to your MongoDB version)
"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath C:\data\db

# macOS/Linux
mongod --dbpath /data/db
```

### 4️⃣ Run the Servers

```bash
# Terminal 1 — Backend
cd server
node src/server.js

# Terminal 2 — Frontend
cd client
npm run dev
```

### 5️⃣ Open the App

| Service | URL |
|---|---|
| 🌐 Student App | http://localhost:5173 |
| 🛡️ Admin Panel | http://localhost:5173/admin/dashboard |
| 🔌 API Server | http://localhost:5000/api |

---

## 🔐 Admin Panel

### Login Credentials

> The admin account is **automatically seeded** on first server boot from environment variables.

| Field | Value |
|---|---|
| 📧 **Email** | `campus_admin@campusskills.edu` |
| 🔑 **Password** | `Skill@2026` |
| 🛡️ **Role** | `admin` |

> **Fallback (if `.env` not configured):**  
> Email: `admin@campusskills.edu` / Password: `admin123`

### Admin Panel Pages

```
/admin/dashboard  →  Analytics, stats, skills chart
/admin/users      →  View, block, ban, delete students
/admin/sessions   →  Monitor and manage all sessions
/admin/settings   →  Toggle platform features
```

---

## 🧠 Matching Engine

The core algorithm scores pairs of students based on complementary skills:

```js
score = (teachMatch × 3) + (learnMatch × 3) + (mutualBoost × 2)
```

- **teachMatch** — Skills User A can teach that User B wants to learn
- **learnMatch** — Skills User B can teach that User A wants to learn
- **mutualBoost** — Extra points for perfect mutual interest overlap

Results are filtered (score > 0) and sorted by highest score first.

---

## 🏆 Trust Score System

```
trustScore = (averageRating × 0.7) + (completedSessions × 0.3)
```

Recalculated automatically whenever a peer leaves a rating.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`  
Protected routes require: `Authorization: Bearer <token>`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create student account |
| `POST` | `/auth/login` | Public | Login and receive JWT |
| `GET` | `/auth/me` | Student | Get current user |
| `GET` | `/users/profile` | Student | Get own profile |
| `PUT` | `/users/profile` | Student | Update skills |
| `PUT` | `/users/change-password` | Student | Change password |
| `GET` | `/match/suggestions` | Student | Get matched peers |
| `POST` | `/match/roadmap` | Student | Get AI learning roadmap |
| `POST` | `/session/request` | Student | Request a session |
| `PUT` | `/session/update` | Student | Accept/Complete/Reject |
| `GET` | `/session/my` | Student | View own sessions |
| `POST` | `/rating` | Student | Rate a peer |
| `GET` | `/admin/analytics` | Admin | Platform statistics |
| `GET` | `/admin/users` | Admin | All users |
| `DELETE` | `/admin/users/:id` | Admin | Delete user |
| `PATCH` | `/admin/users/:id/block` | Admin | Toggle block |
| `PATCH` | `/admin/users/:id/ban` | Admin | Permanent ban |
| `GET` | `/admin/sessions` | Admin | All sessions |
| `PATCH` | `/admin/sessions/:id/force-complete` | Admin | Force complete |
| `GET` | `/admin/settings` | Admin | Get platform settings |
| `PUT` | `/admin/settings` | Admin | Update settings |

---

## 🏗️ Architecture

```
campus-skill-exchange/
│
├── client/                         # React + Vite + Tailwind Frontend
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx           # Glass nav with theme toggle
│       │   ├── AdminLayout.jsx      # Dark sidebar for admin
│       │   └── ThemeToggle.jsx      # Light/Dark switcher
│       ├── context/
│       │   └── AuthContext.jsx      # JWT state management
│       ├── pages/
│       │   ├── Login.jsx            # Auth with toast feedback
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx        # Student home
│       │   ├── Profile.jsx          # Skills + change password
│       │   ├── Matches.jsx          # Engine results
│       │   ├── Sessions.jsx         # Session lifecycle
│       │   └── admin/
│       │       ├── AdminDashboard.jsx   # Stats + Recharts
│       │       ├── AdminUsers.jsx       # User moderation table
│       │       ├── AdminSessions.jsx    # Session control
│       │       └── AdminSettings.jsx    # Platform toggles
│       └── services/
│           ├── api.js               # Axios + auto token injection
│           └── adminAPI.js          # Admin API calls
│
├── server/                         # Node.js + Express Backend
│   └── src/
│       ├── config/
│       │   ├── db.js                # Mongoose connection
│       │   └── env.js               # Fail-safe env loader
│       ├── models/
│       │   ├── User.js              # role, status, trustScore
│       │   ├── Session.js           # PENDING→ACCEPTED→COMPLETED
│       │   ├── Rating.js
│       │   └── Setting.js           # Platform feature flags
│       ├── controllers/             # Route logic
│       ├── services/
│       │   ├── matchingEngine.js    # ⭐ Core matching + AI
│       │   └── trustScore.js        # Auto-recalculates on rating
│       ├── middleware/
│       │   └── authMiddleware.js    # protect + adminProtect
│       └── routes/                  # Modular route files
│
└── docs/
    └── API.md                       # Full API documentation
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- JWT tokens expire in **30 days** (configurable)
- `adminProtect` middleware blocks all non-admin API access with `403 Forbidden`
- Blocked/Banned users receive clear error on login attempt
- Environment variables have **safe fallbacks** — server never crashes on missing `.env`

---

## 🧪 Test It End-to-End

1. Register **two student accounts** in different browsers
2. On each profile, add complementary skills:
   - Student A: Teaches `Python`, Wants `React`
   - Student B: Teaches `React`, Wants `Python`
3. Check **Matches** tab — they'll appear as a **perfect match** with a high score
4. Send a **session request**, accept it, complete it, and submit a **rating**
5. Watch the **Trust Score** update automatically

---

## 🚀 Built For

> **Hackathon Project** — Built to demonstrate a real, production-quality product that students would actually use.

**Stack:** React · Vite · Tailwind CSS · Node.js · Express · MongoDB · Mongoose · JWT · bcrypt · Recharts · react-hot-toast · Lucide Icons

---

<div align="center">

Made with ❤️ for the Campus Community

</div>
=======
# campus-skill-exchange
A full-stack peer-to-peer learning platform where college students exchange skills, build trust, and grow together. Features intelligent matching, session management, ratings system, and an admin control panel.
>>>>>>> ad1dbb988ae5efe6f1a2dee5e51338c3e7918b85
