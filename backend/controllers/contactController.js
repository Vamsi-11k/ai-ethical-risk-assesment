import { validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

export const submitContact = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(errorMsgs, 400));
  }

  const { name, email, subject, message } = req.body;

  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    status: 'success',
    message: 'Message received successfully!',
    data: {
      id: contact._id,
      name: contact.name,
      email: contact.email,
    },
  });
});
