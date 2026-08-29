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

/** Rejects the request unless a valid JWT is present. */
export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    return next(ApiError.unauthorized('Missing authentication token'));
  }
  try {
    const decoded = jwt.verify(token, env.SECRET_KEY) as AuthPayload;
    req.user = { sub: decoded.sub, role: decoded.role };
    next();
  } catch {
    // We do not distinguish expired from malformed from badly signed: all the
    // client needs to know is that it has to authenticate again.
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}

/** Restricts a route to the given roles. Must run after requireAuth. */
export function requireRole(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(ApiError.unauthorized());
    if (!roles.includes(req.user.role)) return next(ApiError.forbidden());
    next();
  };
}

/**
 * Allows the action when the authenticated user owns the resource (the :id in
 * the route) or is an admin. This covers the case the previous version had
 * backwards, where a regular user could not edit their own profile.
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
