import { z } from 'zod';
import { httpUrl } from '../../lib/httpUrl.js';

export const createFlatSchema = z.object({
  city: z.string().trim().min(1, 'City is required').max(120),
  streetName: z.string().trim().min(1, 'Street is required').max(160),
  streetNumber: z.coerce.number().int().min(0),
  areaSize: z.coerce.number().positive('Area must be greater than zero'),
  hasAC: z.boolean().default(false),
  yearBuilt: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear(), 'Year built cannot be in the future'),
  rentPrice: z.coerce.number().min(0),
  dateAvailable: z.coerce.date(),
  description: z.string().trim().max(2000).optional(),
  imageUrls: z
    .array(httpUrl('Each image must be a valid http(s) URL'))
    .max(10, 'A flat can have at most 10 images')
    .optional(),
});

export const updateFlatSchema = createFlatSchema.partial().strict();

export const flatQuerySchema = z
  .object({
    city: z.string().trim().min(1).optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minArea: z.coerce.number().min(0).optional(),
    maxArea: z.coerce.number().min(0).optional(),
    hasAC: z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),
    sortBy: z.enum(['city', 'rentPrice', 'areaSize', 'createdAt']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .refine((q) => q.minPrice === undefined || q.maxPrice === undefined || q.minPrice <= q.maxPrice, {
    message: 'minPrice cannot be greater than maxPrice',
    path: ['minPrice'],
  });
