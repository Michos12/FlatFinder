import type { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Wraps an async handler so any rejection reaches the error middleware
 * instead of being swallowed by an unhandled promise.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    void fn(req, res, next).catch(next);
  };
}
