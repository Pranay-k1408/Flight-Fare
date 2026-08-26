import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import flightRoutes from './routes/flightRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/flights', flightRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Flight Fare API service is online' });
});

// Serve frontend static build if present (Unified Single-Service Deployment)
const frontendDist = path.resolve(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  
  // All remaining GET requests deliver the React SPA index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Fallback root endpoint if frontend is hosted separately
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
}

app.listen(PORT, () => {
  console.log(`✈️ Flight Fare Server running on port ${PORT}`);
});
