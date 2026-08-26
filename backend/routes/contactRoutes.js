import express from 'express';
import { check } from 'express-validator';
import { submitContact } from '../controllers/contactController.js';

const router = express.Router();

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('subject', 'Subject is required').notEmpty(),
    check('message', 'Message is required').notEmpty(),
  ],
  submitContact
);

export default router;
