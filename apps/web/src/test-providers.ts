import {
  provideZonelessChangeDetection,
  type EnvironmentProviders,
  type Provider,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';
import { errorInterceptor } from './app/core/interceptors/error.interceptor';

/**
 * Providers every spec gets for free.
 *
 * The application runs zoneless, so the tests must too: without this the
 * TestBed falls back to Zone.js change detection and fails with NG0908.
 * HttpClient is backed by the testing controller so no spec can reach the
 * network by accident, and carries the same interceptors as the real app —
 * without them a spec would silently exercise a pipeline the browser never
 * runs.
 *
 * The router needs a /login route because AuthService.logout() navigates
 * there, and errorInterceptor calls it on any 401. With an empty route table
 * that navigation rejects with NG04002, which surfaces as an unhandled
 * rejection: every test still passes, but the run exits non-zero and fails CI.
 */
const providers: (Provider | EnvironmentProviders)[] = [
  provideZonelessChangeDetection(),
  provideRouter([{ path: 'login', children: [] }]),
  provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  provideHttpClientTesting(),
];

export default providers;
