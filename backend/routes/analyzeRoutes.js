import express from 'express';
import { check } from 'express-validator';
import { analyzeSystem, getMyScans, getScanTechStack, checkHallucination } from '../controllers/analyzeController.js';
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

router.post(
  '/hallucination',
  optionalAuth,
  [
    check('text', 'Please provide AI text to inspect (minimum 12 characters).').isString().trim().isLength({ min: 12 }),
  ],
  checkHallucination
);

router.get('/scans', protect, getMyScans);
router.get('/scans/:id/tech-stack', optionalAuth, getScanTechStack);
router.get('/tech-stack', optionalAuth, getScanTechStack);

export default router;
