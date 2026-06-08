import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const strongPasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    passwordRegex,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerStep1Schema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const registerStep2Schema = z.object({
  companyName: z.string().trim().min(2, 'Company name is required'),
  phone: z.string().trim().min(6, 'Valid contact phone number is required'),
  industry: z.string().trim().min(2, 'Industry sector is required'),
});

export const registerStep3Schema = z.object({
  role: z.enum(['BUYER', 'SUPPLIER', 'PROCUREMENT_MANAGER', 'ADMIN']),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
  password: strongPasswordSchema,
  companyName: z.string().trim().min(2, 'Company name is required'),
  phone: z.string().trim().min(6, 'Valid phone number is required'),
  industry: z.string().trim().min(2, 'Industry is required'),
  role: z.enum(['BUYER', 'SUPPLIER', 'PROCUREMENT_MANAGER', 'ADMIN']),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: strongPasswordSchema,
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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
  rfqId: z.string().min(1, 'Invalid RFQ ID'),
  price: z.number().positive('Price must be greater than zero'),
  deliveryTimeline: z.string().min(2, 'Delivery timeline is required'),
  comments: z.string().optional(),
});
