import AppError from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid resource ID: ${err.value}`;
    error = new AppError(message, 400);
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered for '${field}'. Please use another value.`;
    error = new AppError(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
