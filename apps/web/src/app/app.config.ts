import { registerLocaleData } from '@angular/common';
import localeEnCa from '@angular/common/locales/en-CA';
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

// en-CA para que CurrencyPipe muestre CAD como "$2,000" y no como "CA$2,000",
// que es lo que hace el en-US por defecto.
registerLocaleData(localeEnCa);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-CA' },
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
