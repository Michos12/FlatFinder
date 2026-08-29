import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { ApiError } from '../lib/ApiError.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
};

/** Punto único de traduccion de errores a respuestas HTTP. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
    return;
  }

  // Un ObjectId malformado es culpa del cliente, no del servidor.
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_ID', message: `Invalid identifier: ${err.value}` },
    });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const details: Record<string, string[]> = {};
    for (const [field, issue] of Object.entries(err.errors)) {
      details[field] = [issue.message];
    }
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Invalid data', details },
    });
    return;
  }

  // Indice único violado (email repetido en una carrera entre dos registros).
  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    res.status(409).json({
      success: false,
      error: { code: 'CONFLICT', message: 'That resource already exists' },
    });
    return;
  }

  console.error('[error no controlado]', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      // En produccion no se filtra el detalle interno al cliente.
      message:
        env.NODE_ENV === 'production'
          ? 'Internal server error'
          : err instanceof Error
            ? err.message
            : String(err),
    },
  });
};
