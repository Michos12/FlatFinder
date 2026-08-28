import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'El mensaje no puede estar vacio')
    .max(2000, 'El mensaje no puede superar los 2000 caracteres'),
});
