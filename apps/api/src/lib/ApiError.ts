/**
 * Error con código HTTP y un código estable que el frontend puede comparar
 * sin depender del texto del mensaje.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string, details?: Record<string, string[]>) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Not authenticated') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'You do not have permission to do that') {
    return new ApiError(403, 'FORBIDDEN', message);
  }

  static notFound(resource: string) {
    return new ApiError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static conflict(message: string) {
    return new ApiError(409, 'CONFLICT', message);
  }
}
