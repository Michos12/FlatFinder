import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@flatfinder/types';
import { ApiService } from './api.service';

const TOKEN_KEY = 'flatfinder.token';

/**
 * The token lives in localStorage. That is exposed to XSS, but the
 * alternative (an httpOnly cookie) needs the API and the frontend to share a
 * domain, or CSRF handling, and neither is in scope yet.
 */
function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly tokenSignal = signal<string | null>(readStoredToken());
  private readonly userSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly currentUser = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);
  readonly isAdmin = computed(() => this.userSignal()?.role === 'admin');

  private persist(response: AuthResponse): void {
    this.tokenSignal.set(response.token);
    this.userSignal.set(response.user);
    try {
      localStorage.setItem(TOKEN_KEY, response.token);
    } catch {
      // Private mode or blocked storage: the session lasts as long as the tab.
    }
  }

  login(input: LoginInput) {
    return this.api
      .post<AuthResponse>('/users/login', input)
      .pipe(tap((response) => this.persist(response)));
  }

  register(input: RegisterInput) {
    return this.api
      .post<AuthResponse>('/users/register', input)
      .pipe(tap((response) => this.persist(response)));
  }

  /**
   * Only the token survives a reload, not the user. This fetches them from the
   * API before the first protected route is painted.
   */
  loadCurrentUser() {
    return this.api.get<User>('/users/me').pipe(tap((user) => this.userSignal.set(user)));
  }

  setCurrentUser(user: User): void {
    this.userSignal.set(user);
  }

  logout(redirectTo: string | null = '/login'): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Nothing to clear when storage is unavailable.
    }
    if (redirectTo) void this.router.navigate([redirectTo]);
  }
}
