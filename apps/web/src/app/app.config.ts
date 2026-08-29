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

// en-CA so CurrencyPipe renders CAD as "$2,000" rather than the "CA$2,000"
// the default en-US produces.
registerLocaleData(localeEnCa);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-CA' },
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    // After a reload only the token survives, so the user is fetched before
    // the first render to keep the header and the role guards from flickering.
    //
    // The failure is swallowed rather than treated as a logout: a network
    // error or a 500 means the server is having a bad moment, not that the
    // session is invalid, and dropping it would sign the user out every time
    // the API hiccups. Only a 401 ends the session, and errorInterceptor
    // already takes care of that.
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      if (!auth.isAuthenticated()) return;
      return auth.loadCurrentUser().pipe(catchError(() => of(null)));
    }),
  ],
};
