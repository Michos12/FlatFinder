import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  LOCALE_ID,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { catchError, of } from 'rxjs';
import { AuthService } from './core/api/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { routes } from './app.routes';

// Sin esto, DatePipe y CurrencyPipe formatean en en-US: las fechas salían
// como "January 9, 2027" y los precios como "$2,000.00" en una interfaz
// enteramente en español.
registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // Tras recargar la página solo queda el token: se recupera el usuario
    // antes del primer render para que la cabecera y los guardas de rol no
    // parpadeen. Si el token ya no vale, se cierra la sesión sin bloquear
    // el arranque.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      if (!auth.isAuthenticated()) return;
      return auth.loadCurrentUser().pipe(
        catchError(() => {
          auth.logout(null);
          return of(null);
        }),
      );
    }),
  ],
};
