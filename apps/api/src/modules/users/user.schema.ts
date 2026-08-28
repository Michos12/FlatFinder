import { z } from 'zod';
import { USER_ROLES } from '@flatfinder/types';

const email = z.string().trim().toLowerCase().email('Email invalido');

/**
 * Minimo razonable para una app de portafolio: longitud suficiente y algo de
 * variedad. No se limita el maximo por arriba mas alla del limite de bcrypt.
 */
const password = z
  .string()
  .min(8, 'La contrasena debe tener al menos 8 caracteres')
  .max(72, 'La contrasena no puede superar los 72 caracteres')
  .regex(/[a-z]/, 'Debe incluir una minuscula')
  .regex(/[A-Z]/, 'Debe incluir una mayuscula')
  .regex(/[0-9]/, 'Debe incluir un numero');

const birthDate = z.coerce
  .date()
  .max(new Date(), 'La fecha de nacimiento no puede ser futura')
  .refine((d) => d.getFullYear() > 1900, 'Fecha de nacimiento poco plausible');

export const registerSchema = z.object({
  email,
  password,
  firstName: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
  lastName: z.string().trim().min(1, 'El apellido es obligatorio').max(80),
  birthDate,
  // 'role' se omite deliberadamente: aceptarlo aqui permitia registrarse
  // como admin enviandolo en el cuerpo de la peticion.
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'La contrasena es obligatoria'),
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
