import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    email: z.email('Valid email is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must include one uppercase letter')
      .regex(/[a-z]/, 'Password must include one lowercase letter')
      .regex(/[0-9]/, 'Password must include one number')
      .regex(/[^A-Za-z0-9]/, 'Password must include one special character'),
    role: z.enum(['USER', 'ADMIN']).optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.email('Valid email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});
