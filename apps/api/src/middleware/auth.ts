import type { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@flatfinder/types';
import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

export interface AuthPayload {
  sub: string;
  role: UserRole;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.header('authorization');
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

/** Rechaza la petición si no llega un JWT válido. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    return next(ApiError.unauthorized('Falta el token de autenticación'));
  }
  try {
    const decoded = jwt.verify(token, env.SECRET_KEY) as AuthPayload;
    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch {
    // No distinguimos entre token caducado, malformado o con firma inválida:
    // al cliente le basta con saber que debe volver a autenticarse.
    next(ApiError.unauthorized('Token inválido o caducado'));
  }
}

/** Restringe la ruta a los roles indicados. Debe ir después de requireAuth. */
export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

/**
 * Permite la acción si el usuario autenticado es el dueno del recurso
 * (:id de la ruta) o si es admin. Cubre el caso que la versión anterior
 * tenia invertido: un usuario normal no podia editar su propio perfil.
 */
export function requireSelfOrAdmin(param = 'id'): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (req.user.role === 'admin' || req.user.sub === req.params[param]) {
      return next();
    }
    next(ApiError.forbidden());
  };
}
