import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Envuelve un handler asincrono para que cualquier rechazo llegue al
 * middleware de errores, en vez de quedarse en una promesa sin capturar.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
}
