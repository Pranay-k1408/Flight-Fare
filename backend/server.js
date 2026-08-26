import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightRoutes from './routes/flightRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

// Initialize MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/flights', flightRoutes);
app.use('/api/auth', authRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Flight Fare Backend API',
    message: 'Backend service is online and running successfully ✈️',
    endpoints: {
      health: '/api/health',
      flights: '/api/flights',
      auth: '/api/auth'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flight Fare API service is online' });
});

app.listen(PORT, () => {
  console.log(`✈️ Flight Fare Backend API server running on http://localhost:5000`);
});
