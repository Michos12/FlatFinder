import { z } from 'zod';

export const createMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'The message cannot be empty')
    .max(2000, 'The message cannot exceed 2000 characters'),
});
