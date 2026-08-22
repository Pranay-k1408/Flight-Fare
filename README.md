# ✈️ Flight-Fare

Flight-Fare is a full-stack flight booking application that allows users to search for flights, compare fares, select seats, make bookings, and receive their booking details digitally.

The project was built using **React, Node.js, Express, and MongoDB**, with additional integrations for OTP verification, email delivery, weather information, and PDF ticket generation.

## Features

* 🔎 Flight search and filtering
* 💰 Flight fare comparison
* 📊 Fare information and fare trends
* 📅 7-day fare view
* 🌦️ Destination weather information
* 🔐 User authentication
* 📱 OTP verification
* 💺 Interactive seat selection
* ✈️ Flight booking
* 🎫 PNR generation
* 📄 PDF boarding pass generation
* 📧 Booking/ticket delivery through email
* 📱 Responsive interface
* 📋 Booking details and history
* 🛡️ Validation and error handling

## Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* JavaScript
* React Router
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Nodemailer
* Twilio

### Other

* PDF generation
* Barcode generation
* External flight/weather APIs

## Project Structure

```text
Flight-Fare/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── package.json
│
├── .gitignore
└── README.md
```

## How It Works

### 1. Search Flights

Users enter their:

* Departure city
* Destination
* Travel date
* Number of passengers

The application retrieves available flight information and displays the available options.

### 2. Compare Fares

Users can compare available flights based on fare, airline, timing, and other available flight information.

### 3. Select Seats

After selecting a flight, users can choose available seats through the interactive seat-selection interface.

### 4. Complete Booking

The booking process collects the required passenger information and confirms the selected flight and seats.

### 5. Receive Booking Details

After a successful booking, the application generates booking information including a PNR and boarding-pass PDF.

The ticket can also be delivered through email.

## Authentication

The application uses authentication and OTP verification for account-related operations.

Sensitive configuration values such as database credentials, API keys, and authentication secrets are stored using environment variables.

## Environment Variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000

MONGODB_URI=

JWT_SECRET=

EMAIL_USER=
EMAIL_PASSWORD=

TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

FLIGHT_API_KEY=
WEATHER_API_KEY=
```

Use your own credentials for the required services.

**Do not commit the `.env` file to GitHub.**

## Installation

Clone the repository:

```bash
git clone https://github.com/Pranay-k1408/Flight-Fare.git
cd Flight-Fare
```

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will then be available through the Vite development server.

## API Overview

The backend provides APIs for the main application functionality, including:

```text
Authentication
Flight search
Fare information
Bookings
Seat selection
User information
OTP verification
Weather information
Ticket generation
```

The exact endpoints and request formats can be found inside the backend route files.

## Screenshots

Add screenshots of the main application pages here.

Recommended screenshots:

* Login/Register
* Home/Search page
* Flight results
* Fare comparison
* Seat selection
* Passenger details
* Booking confirmation
* Generated boarding pass

## Future Improvements

Some improvements that could be added in future versions:

* Payment gateway integration
* More flight providers
* Improved fare prediction
* Cancellation and refund processing
* Admin dashboard
* More detailed booking history
* Improved notification system
* Deployment with CI/CD

## License

This project is licensed under the MIT License.


---

## 📜 License
MIT License © 2026 Skyward Global Inc.
