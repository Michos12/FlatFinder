import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../api/auth.service';

/** A readable message pulled out of the API error envelope. */
export function messageOf(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { error?: { message?: string } } | null;
    if (body?.error?.message) return body.error.message;
    if (error.status === 0) return 'Could not reach the server';
  }
  return 'Something went wrong';
}

/**
 * A 401 means the token is no longer good, so the session is dropped rather
 * than leaving the user browsing with dead credentials.
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
