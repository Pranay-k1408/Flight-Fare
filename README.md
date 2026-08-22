# ✈️ Skyward Global — AI Flight Fare Prediction & Booking Platform

A modern, production-grade flight fare aggregator and ticket reservation web application featuring 7-day fare prediction calendars, dynamic destination weather forecasts, interactive seat allocation, Twilio SMS & Email OTP authentication, MongoDB Atlas persistence, and automated PDF boarding pass dispatch.

---

## 🌟 Key Features

- **Dynamic Route Search**: Instant flight search across domestic and international airport hubs (Delhi, Mumbai, Bengaluru, Goa, London, Dubai, New York, Tokyo, etc.).
- **Per-Traveler Pricing & Smart Insights**: Transparent price analytics (Best, Average, Highest Fares) with dynamic single-person rate filters.
- **Interactive 7-Day Fare Calendar**: Visual price heatmap indicating the cheapest dates to fly.
- **Dynamic Destination Weather**: Live temperature, weather condition icons, and travel recommendations for the arrival city.
- **Interactive Seat Map**: Dynamic seat selection (defaulting to 1 traveler) with real-time seat toggling and fare calculation.
- **Multi-Factor OTP Authentication**:
  - 📱 **Real Phone SMS OTP** via Twilio Verify API.
  - 📧 **Enterprise Email OTP** via SMTP Gmail.
- **Cloud Database (MongoDB Atlas)**:
  - User profiles, authentication status, member join dates.
  - Confirmed flight reservations with unique PNR codes.
- **Automated PDF Boarding Pass**: Instant PDF generation and email delivery with airline logos and seat barcodes.
- **Interactive Information & Legal Hub**: Full interfaces for Privacy Policy, Terms, Security & Trust, Refund Policies, Refer & Earn, App Download, and Support Desk.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, TailwindCSS / Custom Design Tokens, Lucide Icons, jsPDF.
- **Backend**: Node.js, Express.js, Mongoose, Twilio SDK, Nodemailer.
- **Database**: MongoDB Atlas (Cloud Cluster).

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Pranay-k1408/Flight-Fare.git
cd Flight-Fare
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
npm install
node server.js
```

### 3. Run Frontend
```bash
cd ../frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License
MIT License © 2026 Skyward Global Inc.
