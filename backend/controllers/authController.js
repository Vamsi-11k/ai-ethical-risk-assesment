import { validationResult } from 'express-validator';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

export const signup = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(errorMsgs, 400));
  }

  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('User already exists with this email', 400));
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map((err) => err.msg).join(', ');
    return next(new AppError(errorMsgs, 400));
  }

  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  const token = generateToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });
});
