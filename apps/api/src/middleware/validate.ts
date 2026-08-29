import type { RequestHandler } from 'express';
import { ZodError, type ZodType } from 'zod';
import { ApiError } from '../lib/ApiError.js';

type Target = 'body' | 'query' | 'params';

function toDetails(error: ZodError): Record<string, string[]> {
  const details: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_';
    (details[key] ??= []).push(issue.message);
  }
  return details;
}

/** Validates and normalises one part of the request against a Zod schema. */
export function validate(schema: ZodType, target: Target = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(
        ApiError.badRequest('The submitted data is not valid', toDetails(result.error)),
      );
    }
    // Reassigned so we keep the parsed value (dates, numbers, booleans) and
    // drop any keys the schema does not describe.
    Object.defineProperty(req, target, { value: result.data, writable: true });
    next();
  };
}
