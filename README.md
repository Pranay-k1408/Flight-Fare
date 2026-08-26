# ✈️ Flight-Fare — Full-Stack Flight Search, Fare Analytics & Booking Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-blue?style=for-the-badge&logo=render)](https://flight-fare-xsyv.onrender.com)
[![GitHub license](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> 🚀 **Live Production Deployment**: [**https://flight-fare-xsyv.onrender.com**](https://flight-fare-xsyv.onrender.com)

A full-stack web application designed for comprehensive flight route searching, multi-tier fare analytics, interactive seat selection, Google OAuth & OTP-based user authentication, and automated PDF boarding pass generation.

---

## 📌 Project Overview

**Flight-Fare** provides a streamlined flight discovery and booking workflow with realistic pricing analytics across domestic and international airport hubs. It combines an interactive React frontend with an Express.js REST API and MongoDB storage.

### Key Capabilities
- **Airport & Route Search**: Real-time multi-city search with debounced autocomplete for major domestic and international airport hubs.
- **7-Day Fare Analytics Matrix**: Visual price comparison heatmap across dates to easily spot lowest available fares.
- **Flight Filtering & Sorting**: Multi-parameter filtering by price, stops (direct / 1-stop), airlines, and sorting by cheapest, fastest, or departure time.
- **Destination Weather Context**: Live weather conditions and temperature indicators for arrival cities.
- **Multi-Passenger Seat Selection**: Interactive aircraft seat map with live pricing and seat allocation per passenger.
- **Authentication & Verification**: Phone SMS verification via Twilio and Email OTP via SMTP Nodemailer (with resilient demo mode fallbacks).
- **Payment & Boarding Pass**: Checkout interface supporting Credit/Debit Cards, UPI/QR code, and Net Banking, followed by automated PDF boarding pass generation with airline branding and unique PNR codes.

---

## 🏗️ Architecture & Tech Stack

```
Flight-Fare/
├── backend/
│   ├── config/             # MongoDB database connection configuration
│   ├── controllers/        # Flight search, booking, and auth controllers
│   ├── data/               # Static airport hubs and flight generation data
│   ├── models/             # Mongoose schemas (User, Booking, Otp)
│   ├── routes/             # Express API route declarations
│   ├── services/           # PDF ticket generation service (PDFKit)
│   └── server.js           # Express API server entry point
│
└── frontend/
    ├── public/             # Static assets, SVG icons, background artwork
    ├── src/
    │   ├── assets/         # App icons and media assets
    │   ├── components/     # React modular UI components & modals
    │   ├── services/       # Frontend API client and auth services
    │   ├── App.jsx         # Root application layout & state orchestrator
    │   ├── App.css         # Component utility styling
    │   └── index.css       # Theme tokens, custom CSS variables, Tailwind
    └── vite.config.js      # Vite build and proxy configuration
```

### Technology Breakdown
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React Icons, jsPDF, html2canvas
- **Backend**: Node.js (ES Modules), Express.js 4, Mongoose 9, Twilio SDK, Nodemailer, PDFKit
- **Database**: MongoDB / MongoDB Atlas

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local instance or free MongoDB Atlas URI)

---

### 1. Clone the Repository
```bash
git clone https://github.com/Pranay-k1408/Flight-Fare.git
cd Flight-Fare
```

---

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory based on `.env.example`:
```bash
cp .env.example .env
```

#### Environment Variables Configuration (`backend/.env`):
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/flightfare` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_SECURE` | Use SSL/TLS (`true` / `false`) | `false` |
| `SMTP_USER` | SMTP username / email address | `your_email@gmail.com` |
| `SMTP_PASS` | SMTP application password | `your_app_password` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID for SMS OTP | `your_twilio_account_sid` |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | `your_twilio_auth_token` |
| `TWILIO_PHONE_NUMBER` | Twilio Phone Number | `your_twilio_phone_number` |
| `TWILIO_VERIFY_SERVICE_SID` | Twilio Verify Service SID | `your_verify_service_sid` |

Start the backend API server:
```bash
# Production start
npm start

# Development mode with watch
npm run dev
```
Backend API will be running on `http://localhost:5000`.

---

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173` (or the port specified in Vite output).

---

## 📡 REST API Documentation

### Flight & Search Endpoints (`/api/flights`)

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/flights/airports/search` | `?q=<query>` | Search airport hubs by city, name, or IATA code. |
| `GET` | `/api/flights/search` | `?origin=DEL&destination=BOM&date=YYYY-MM-DD&passengers=1&cabinClass=Economy&sortBy=price` | Returns filtered flight listings, price metrics, and weather insights. |
| `GET` | `/api/flights/fare-calendar` | `?origin=DEL&destination=BOM&startDate=YYYY-MM-DD&passengers=1` | Returns 7-day fare prediction calendar matrix. |
| `GET` | `/api/flights/airlines` | — | Returns list of participating airlines with ratings. |
| `POST` | `/api/flights/book` | `{ flight, passengers, pnr, totalAmount, currency, paymentMethod, email }` | Records booking, generates PDF ticket, and dispatches email. |
| `GET` | `/api/flights/:id` | `id` (path param) | Returns aircraft seat layout and baggage allowance. |

---

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Payload | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | `{ recipient: "+919876543210", type: "phone" \| "email" }` | Dispatches 6-digit OTP via Twilio SMS or SMTP email. |
| `POST` | `/api/auth/verify-otp` | `{ recipient: "+919876543210", otp: "123456", name: "User" }` | Validates verification code and registers/retrieves user profile. |
| `POST` | `/api/auth/social-login` | `{ provider: "Google" \| "Apple", email: "user@example.com", name: "User" }` | Social login handler with token creation. |

---

## 🔒 Security & Best Practices
- **Environment Isolation**: All sensitive credentials (`.env`) are strictly excluded from version control via `.gitignore`.
- **Sanitized Fallbacks**: The application gracefully falls back to local data simulations and test SMTP services if external cloud services are offline or not configured.

---

## 📜 License
MIT License © 2026 Flight-Fare.
