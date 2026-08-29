import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, type ActivatedRouteSnapshot, type RouterStateSnapshot } from '@angular/router';
import type { User } from '@flatfinder/types';
import { environment } from '../../../environments/environment';
import { AuthService } from '../api/auth.service';
import { adminGuard } from './admin.guard';
import { authGuard } from './auth.guard';

const TOKEN_KEY = 'flatfinder.token';

const user: User = {
  id: 'u1',
  email: 'michael@flatfinder.test',
  firstName: 'Michael',
  lastName: 'Veliz',
  birthDate: '1998-04-12T00:00:00.000Z',
  role: 'guest',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const route = {} as ActivatedRouteSnapshot;
const stateFor = (url: string) => ({ url }) as RouterStateSnapshot;

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => localStorage.clear());

  it('lets an authenticated user through', () => {
    localStorage.setItem(TOKEN_KEY, 'a-token');
    const result = TestBed.runInInjectionContext(() => authGuard(route, stateFor('/my-flats')));
    expect(result).toBe(true);
  });

  it('sends anyone else to the login page', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(route, stateFor('/my-flats')));
    expect(result).toBeInstanceOf(UrlTree);
  });

  it('remembers where the user was headed', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard(route, stateFor('/flats/abc')),
    ) as UrlTree;

    // Without returnUrl the user lands on the listing after logging in,
    // instead of the page they actually asked for.
    expect(TestBed.inject(Router).serializeUrl(result)).toContain('returnUrl=%2Fflats%2Fabc');
  });
});

describe('adminGuard', () => {
  let auth: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => localStorage.clear());

  /**
   * AuthService reads the stored token when it is constructed, so the token has
   * to be in place before anything injects it.
   */
  function signedInWith(token: string | null): void {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  }

  it('sends an anonymous visitor to the login page', async () => {
    signedInWith(null);
    const result = await TestBed.runInInjectionContext(() => adminGuard(route, stateFor('/users')));
    expect(result).toBeInstanceOf(UrlTree);
    http.verify();
  });

  it('lets an admin through', async () => {
    signedInWith('a-token');
    auth.setCurrentUser({ ...user, role: 'admin' });

    const result = await TestBed.runInInjectionContext(() => adminGuard(route, stateFor('/users')));
    expect(result).toBe(true);
    http.verify();
  });

  it('turns a non-admin away from the users screen', async () => {
    signedInWith('a-token');
    auth.setCurrentUser(user);

    const result = await TestBed.runInInjectionContext(() => adminGuard(route, stateFor('/users')));
    expect(result).toBeInstanceOf(UrlTree);
    http.verify();
  });

  it('fetches the user when only the token survived a reload', async () => {
    signedInWith('a-token');

    const pending = TestBed.runInInjectionContext(() => adminGuard(route, stateFor('/users')));
    // The role lives on the user, which is not loaded yet right after a reload.
    http.expectOne(`${environment.apiUrl}/users/me`).flush({
      success: true,
      data: { ...user, role: 'admin' },
    });

    expect(await pending).toBe(true);
    http.verify();
  });
});
