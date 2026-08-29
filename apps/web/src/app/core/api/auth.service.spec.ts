import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { AuthResponse, User } from '@flatfinder/types';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

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

const authResponse: AuthResponse = { user, token: 'a-token' };

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('starts signed out when there is no stored token', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('stores the token and the user after logging in', async () => {
    const result = service.login({ email: user.email, password: 'Contrasena1' });
    const done = result.subscribe();

    const request = http.expectOne(`${environment.apiUrl}/users/login`);
    expect(request.request.method).toBe('POST');
    request.flush({ success: true, data: authResponse });

    expect(service.isAuthenticated()).toBe(true);
    expect(service.currentUser()).toEqual(user);
    expect(localStorage.getItem(TOKEN_KEY)).toBe('a-token');
    done.unsubscribe();
  });

  it('stores the session after registering too', () => {
    service
      .register({
        email: user.email,
        password: 'Contrasena1',
        firstName: 'Michael',
        lastName: 'Veliz',
        birthDate: '1998-04-12',
      })
      .subscribe();

    http.expectOne(`${environment.apiUrl}/users/register`).flush({
      success: true,
      data: authResponse,
    });

    expect(service.token()).toBe('a-token');
  });

  it('does not sign anyone in when the credentials are rejected', () => {
    let failed = false;
    service.login({ email: user.email, password: 'wrong' }).subscribe({
      error: () => (failed = true),
    });

    http
      .expectOne(`${environment.apiUrl}/users/login`)
      .flush({ success: false, error: { code: 'INVALID_CREDENTIALS' } }, { status: 401, statusText: 'Unauthorized' });

    expect(failed).toBe(true);
    expect(service.isAuthenticated()).toBe(false);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  it('clears the session and redirects on logout', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    service.login({ email: user.email, password: 'Contrasena1' }).subscribe();
    http.expectOne(`${environment.apiUrl}/users/login`).flush({ success: true, data: authResponse });

    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('can clear the session without navigating', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    service.logout(null);

    expect(navigate).not.toHaveBeenCalled();
  });

  it('reports admin only for the admin role', () => {
    expect(service.isAdmin()).toBe(false);

    service.setCurrentUser(user);
    expect(service.isAdmin()).toBe(false);

    service.setCurrentUser({ ...user, role: 'admin' });
    expect(service.isAdmin()).toBe(true);
  });

  it('recovers the user from a stored token', () => {
    localStorage.setItem(TOKEN_KEY, 'a-token');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    const fresh = TestBed.inject(AuthService);
    const freshHttp = TestBed.inject(HttpTestingController);

    expect(fresh.isAuthenticated()).toBe(true);
    expect(fresh.currentUser()).toBeNull();

    fresh.loadCurrentUser().subscribe();
    freshHttp.expectOne(`${environment.apiUrl}/users/me`).flush({ success: true, data: user });

    expect(fresh.currentUser()).toEqual(user);
    freshHttp.verify();
  });
});
