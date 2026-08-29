import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import type { AuthResponse, LoginInput, RegisterInput, User } from '@flatfinder/types';
import { ApiService } from './api.service';

const TOKEN_KEY = 'flatfinder.token';

/**
 * El token se guarda en localStorage. Es vulnerable a XSS, pero la
 * alternativa (cookie httpOnly) exige que el API y el front compartan
 * dominio o gestionar CSRF, y eso queda fuera del alcance actual.
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
      // Modo privado o almacenamiento bloqueado: la sesion dura lo que la pestana.
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
   * Al recargar la pagina solo sobrevive el token, no el usuario. Esto lo
   * recupera del API antes de que se pinte la primera ruta protegida.
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
      // Nada que limpiar si el almacenamiento no esta disponible.
    }
    if (redirectTo) void this.router.navigate([redirectTo]);
  }
}
