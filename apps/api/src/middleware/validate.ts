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

/** Valida y normaliza una parte de la peticion contra un esquema de Zod. */
export function validate(schema: ZodType, target: Target = 'body'): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(
        ApiError.badRequest('Los datos enviados no son validos', toDetails(result.error)),
      );
    }
    // Se reasigna para quedarnos con el dato ya parseado (fechas, numeros,
    // booleanos) y sin las claves que el esquema no contempla.
    Object.defineProperty(req, target, { value: result.data, writable: true });
    next();
  };
}
