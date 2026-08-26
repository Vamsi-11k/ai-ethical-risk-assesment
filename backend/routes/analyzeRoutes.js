import express from 'express';
import { check } from 'express-validator';
import { analyzeSystem, getMyScans } from '../controllers/analyzeController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/analyze',
  optionalAuth,
  [
    check('url', 'Please provide a website URL').notEmpty(),
  ],
  analyzeSystem
);

router.get('/scans', protect, getMyScans);

export default router;
