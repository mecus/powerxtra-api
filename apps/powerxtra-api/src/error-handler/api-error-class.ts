import winston from 'winston';

import { Request, Response, NextFunction } from "express";

class ApiError extends Error {
  statusCode;
  isOperational;
  constructor(statusCode: any, message: any, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Marks if it's a known app error vs a crash
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' })
  ],
});


export const ErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

  let { statusCode, message } = err;

  // If error is not an instance of ApiError, treat it as a generic Server Error
  if (!(err instanceof ApiError)) {
    statusCode = err.statusCode || 500;
    message = err.message || 'Internal Server Error';
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Hide stack in production
  };

  // Log the error
  if (process.env.NODE_ENV === 'development') {
    logger.error(err);
  } else {
    // In production, only log critical details to avoid noise
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }

  res.status(statusCode).send(response);
};
