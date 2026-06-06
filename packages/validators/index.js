import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'PROCUREMENT', 'VENDOR']),
  vendorId: z.string().uuid().optional(),
});

export const vendorProfileSchema = z.object({
  name: z.string().min(2, 'Vendor name is required'),
  email: z.string().email('Invalid business email'),
  phone: z.string().min(10, 'Valid contact phone number required'),
  address: z.string().min(5, 'Company address is required'),
  registrationNumber: z.string().min(3, 'Registration number is required'),
});

export const rfqSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date string',
  }),
});

export const quotationSchema = z.object({
  rfqId: z.string().uuid('Invalid RFQ ID'),
  price: z.number().positive('Price must be greater than zero'),
  deliveryTimeline: z.string().min(2, 'Delivery timeline is required'),
  comments: z.string().optional(),
});
