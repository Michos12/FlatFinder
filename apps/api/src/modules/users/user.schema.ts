import { z } from 'zod';
import { USER_ROLES } from '@flatfinder/types';

const email = z.string().trim().toLowerCase().email('Invalid email');

/**
 * Mínimo razonable para una app de portafolio: longitud suficiente y algo de
 * variedad. No se limita el máximo por arriba más alla del límite de bcrypt.
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
  // 'role' se omite deliberadamente: aceptarlo aquí permitia registrarse
  // como admin enviandolo en el cuerpo de la petición.
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

/** Solo un admin puede tocar el rol, y por eso vive en un esquema aparte. */
export const updateRoleSchema = z.object({
  role: z.enum(USER_ROLES),
});
