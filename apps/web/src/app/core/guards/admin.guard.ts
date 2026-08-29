import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../api/auth.service';

/**
 * The role lives on the user, which is not loaded yet right after a reload,
 * so this guard is async and asks the API when it has to. It is a navigation
 * convenience only: the backend check is what actually enforces access.
 */
export const adminGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) return router.createUrlTree(['/login']);

  if (!auth.currentUser()) {
    try {
      await firstValueFrom(auth.loadCurrentUser());
    } catch {
      return router.createUrlTree(['/login']);
    }
  }

  return auth.isAdmin() ? true : router.createUrlTree(['/']);
};
