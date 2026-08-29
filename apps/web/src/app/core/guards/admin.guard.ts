import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../api/auth.service';

/**
 * El rol vive en el usuario, que tras recargar la página aun no esta cargado;
 * por eso el guarda es asincrono y lo pide al API si hace falta.
 * Es una comodidad de navegacion: quien manda es la comprobación del backend.
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
