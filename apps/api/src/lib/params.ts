import type { Request } from 'express';
import { ApiError } from './ApiError.js';

/**
 * Express 5 types req.params as string | string[], because a route may repeat
 * the same parameter name. None of ours do, so we normalise here rather than
 * casting in every controller.
 */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value === 'string' && value.length > 0) return value;
  throw ApiError.badRequest(`Missing route parameter "${name}"`);
}
