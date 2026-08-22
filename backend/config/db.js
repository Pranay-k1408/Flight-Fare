import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/flightfare';

export const connectDB = () => {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  }).then((conn) => {
    console.log(`🍃 [MONGODB ATLAS] Connected successfully to Cloud Database: ${conn.connection.name} (Host: ${conn.connection.host})`);
  }).catch((error) => {
    console.warn(`⚠️  [MONGODB] Connection error to ${MONGODB_URI}: (${error.message})`);
  });
};

mongoose.connection.on('disconnected', () => {
  console.log('🍃 [MONGODB] Disconnected from database.');
});

export default connectDB;
