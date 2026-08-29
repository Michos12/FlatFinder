import type { Request } from 'express';
import { ApiError } from './ApiError.js';

/**
 * Express 5 tipa req.params como string | string[], porque una ruta puede
 * repetir el mismo nombre de parámetro. Ninguna de las nuestras lo hace, así
 * que normalizamos aquí en lugar de castear en cada controlador.
 */
export function param(req: Request, name: string): string {
  const value = req.params[name];
  if (typeof value === 'string' && value.length > 0) return value;
  throw ApiError.badRequest(`Missing route parameter "${name}"`);
}
