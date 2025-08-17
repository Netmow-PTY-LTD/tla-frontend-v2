import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z
    .string()
    .nonempty('is required')
    .email('Invalid email address'),

  password: z
    .string()
    .nonempty('is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(), // checkbox is optional
});
