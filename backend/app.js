import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import healthRouter from './routes/health.js';
import authRouter from './routes/authRoutes.js';
import analyzeRouter from './routes/analyzeRoutes.js';
import contactRouter from './routes/contactRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Set security HTTP headers globally
app.use(helmet());

// Configure CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Set up brute-force prevention limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: {
    status: 'error',
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api', analyzeRouter);
app.use('/api/contact', contactRouter);

// Operational Fallbacks and Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
