import { z } from 'zod';
import { USER_ROLES } from '@flatfinder/types';

const email = z.string().trim().toLowerCase().email('Invalid email');

/**
 * A sensible floor for a portfolio app: enough length and some variety. There
 * is no upper bound beyond the limit bcrypt itself imposes.
 */
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(72, 'Password cannot exceed 72 characters')
  .regex(/[a-z]/, 'Must include a lowercase letter')
  .regex(/[A-Z]/, 'Must include an uppercase letter')
  .regex(/[0-9]/, 'Must include a number');

const birthDate = z.coerce
  .date()
  .max(new Date(), 'Date of birth cannot be in the future')
  .refine((d) => d.getFullYear() > 1900, 'Date of birth is not plausible');

export const registerSchema = z.object({
  email,
  password,
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  birthDate,
  // 'role' is left out on purpose: accepting it here let anyone register as
  // an admin just by putting it in the request body.
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().min(1).max(80).optional(),
    birthDate: birthDate.optional(),
    password: password.optional(),
  })
  .strict();

/** Only an admin can touch the role, which is why it lives in its own schema. */
export const updateRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});
