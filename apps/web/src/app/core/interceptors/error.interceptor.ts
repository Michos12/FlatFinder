import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../api/auth.service';

/** Mensaje legible extraido del envoltorio de error del API. */
export function messageOf(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: { message?: string } } | null;
    if (body?.error?.message) return body.error.message;
    if (error.status === 0) return 'Could not reach the server';
  }
  return 'Something went wrong';
}

/**
 * Un 401 significa que el token ya no sirve: se cierra la sesión en lugar de
 * dejar al usuario navegando con credenciales muertas.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((error: unknown) => {
      const isLoginAttempt = req.url.includes('/users/login');
      if (error instanceof HttpErrorResponse && error.status === 401 && !isLoginAttempt) {
        auth.logout();
      }
      return throwError(() => error);
    }),
  );
};
