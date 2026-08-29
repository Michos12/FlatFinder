import { HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import type { AuthResponse } from '@flatfinder/types';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/api/auth.service';
import { Login } from './login';

const authResponse: AuthResponse = {
  token: 'a-token',
  user: {
    id: 'u1',
    email: 'michael@flatfinder.test',
    firstName: 'Michael',
    lastName: 'Veliz',
    birthDate: '1998-04-12T00:00:00.000Z',
    role: 'guest',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
};

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let http: HttpTestingController;
  let navigate: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({ imports: [Login] });

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    navigate = vi
      .spyOn(TestBed.inject(Router), 'navigateByUrl')
      .mockResolvedValue(true) as ReturnType<typeof vi.spyOn>;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('does not call the API for an empty form', () => {
    component.onSubmit();

    http.expectNone(`${environment.apiUrl}/users/login`);
    expect(component.form.controls.email.touched).toBe(true);
  });

  it('rejects an email that is not an email', () => {
    component.form.setValue({ email: 'not-an-email', password: 'Contrasena1' });
    component.onSubmit();

    http.expectNone(`${environment.apiUrl}/users/login`);
  });

  it('signs in and goes to the listing on success', async () => {
    component.form.setValue({ email: 'michael@flatfinder.test', password: 'Contrasena1' });
    component.onSubmit();

    http.expectOne(`${environment.apiUrl}/users/login`).flush({ success: true, data: authResponse });
    await fixture.whenStable();

    expect(navigate).toHaveBeenCalledWith('/');
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(true);
  });

  /**
   * The regression this whole screen was rewritten for: the previous version
   * compared a Promise with `if (user)`, which is always truthy, so any
   * password at all got you in.
   */
  it('does not let a wrong password through', async () => {
    component.form.setValue({ email: 'michael@flatfinder.test', password: 'wrong' });
    component.onSubmit();

    http.expectOne(`${environment.apiUrl}/users/login`).flush(
      { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' } },
      { status: 401, statusText: 'Unauthorized' },
    );
    await fixture.whenStable();

    expect(navigate).not.toHaveBeenCalled();
    expect(TestBed.inject(AuthService).isAuthenticated()).toBe(false);
    expect(component.errorMessage()).toBe('Incorrect email or password');
    expect(component.submitting()).toBe(false);
  });

  it('shows the error on screen', async () => {
    component.form.setValue({ email: 'michael@flatfinder.test', password: 'wrong' });
    component.onSubmit();

    http.expectOne(`${environment.apiUrl}/users/login`).flush(
      { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password' } },
      { status: 401, statusText: 'Unauthorized' },
    );
    await fixture.whenStable();

    const alert = fixture.nativeElement.querySelector('.alert--error');
    expect(alert?.textContent).toContain('Incorrect email or password');
  });
});
