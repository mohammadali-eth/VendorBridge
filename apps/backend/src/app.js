import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { AppError } from '@vendorbridge/shared';
import globalErrorHandler from './middlewares/error.middleware.js';

import authRouter from './modules/auth/auth.routes.js';
import dashboardRouter from './modules/dashboard/dashboard.routes.js';
import vendorRouter from './modules/vendors/vendors.routes.js';
import rfqRouter from './modules/rfq/rfq.routes.js';
import quotationsRouter from './modules/quotations/quotations.routes.js';
import approvalsRouter from './modules/approvals/approvals.routes.js';
import { poRouter, invoiceRouter } from './modules/purchase-orders/purchase-orders.routes.js';
import activityRouter from './modules/activity/activity.routes.js';
import reportsRouter from './modules/reports/reports.routes.js';
import { createVendorSelection } from './modules/rfq/rfq.controller.js';
import { protect } from './middlewares/auth.middleware.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'development' ? 10000 : 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/vendors', vendorRouter);
app.use('/api/v1/rfqs', rfqRouter);
app.use('/api/v1/quotations', quotationsRouter);
app.use('/api/v1/approvals', approvalsRouter);
app.use('/api/v1/purchase-orders', poRouter);
app.use('/api/v1/invoices', invoiceRouter);
app.use('/api/v1/activity', activityRouter);
app.use('/api/v1/reports', reportsRouter);
app.post('/api/v1/vendor-selection', protect, createVendorSelection);

// Catch-all route for undefined paths
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handling middleware
app.use(globalErrorHandler);

export default app;
