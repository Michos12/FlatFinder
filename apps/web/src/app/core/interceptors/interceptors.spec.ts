import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { AuthService } from '../api/auth.service';
import { messageOf } from './error.interceptor';

const TOKEN_KEY = 'flatfinder.token';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('attaches the bearer token when there is a session', () => {
    localStorage.setItem(TOKEN_KEY, 'a-token');
    TestBed.inject(AuthService);

    http.get(`${environment.apiUrl}/flats`).subscribe();

    const request = controller.expectOne(`${environment.apiUrl}/flats`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer a-token');
    request.flush({ success: true, data: [] });
  });

  it('sends nothing when there is no session', () => {
    http.get(`${environment.apiUrl}/flats`).subscribe();

    const request = controller.expectOne(`${environment.apiUrl}/flats`);
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({ success: true, data: [] });
  });
});

describe('errorInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(TOKEN_KEY, 'a-token');
    TestBed.configureTestingModule({});
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    controller.verify();
    localStorage.clear();
  });

  it('ends the session on a 401', () => {
    http.get(`${environment.apiUrl}/flats`).subscribe({ error: () => undefined });

    controller
      .expectOne(`${environment.apiUrl}/flats`)
      .flush({ success: false }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.isAuthenticated()).toBe(false);
  });

  it('keeps the session on a failed login attempt', () => {
    // A rejected login is not an expired session; logging the user out here
    // would wipe a perfectly good token because they mistyped a password.
    http.post(`${environment.apiUrl}/users/login`, {}).subscribe({ error: () => undefined });

    controller
      .expectOne(`${environment.apiUrl}/users/login`)
      .flush({ success: false }, { status: 401, statusText: 'Unauthorized' });

    expect(auth.isAuthenticated()).toBe(true);
  });

  it('leaves the session alone for other failures', () => {
    http.get(`${environment.apiUrl}/flats`).subscribe({ error: () => undefined });

    controller
      .expectOne(`${environment.apiUrl}/flats`)
      .flush({ success: false }, { status: 500, statusText: 'Server Error' });

    expect(auth.isAuthenticated()).toBe(true);
  });
});

describe('messageOf', () => {
  it('pulls the message out of the API error envelope', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { success: false, error: { code: 'BAD_REQUEST', message: 'City is required' } },
    });

    expect(messageOf(error)).toBe('City is required');
  });

  it('explains a dead connection', () => {
    expect(messageOf(new HttpErrorResponse({ status: 0 }))).toBe('Could not reach the server');
  });

  it('falls back to a generic message', () => {
    expect(messageOf(new Error('boom'))).toBe('Something went wrong');
  });
});
