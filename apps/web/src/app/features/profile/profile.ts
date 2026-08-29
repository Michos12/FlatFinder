import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { UpdateUserInput } from '@flatfinder/types';
import { AuthService } from '../../core/api/auth.service';
import { UsersService } from '../../core/api/users.service';
import { messageOf } from '../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly usersService = inject(UsersService);

  readonly user = this.auth.currentUser;
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    birthDate: ['', [Validators.required]],
    // Vacia significa "no cambiar". Antes el formulario exigia la contrasena
    // para cualquier edicion y la reescribia en cada guardado.
    password: ['', [Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
  });

  toggleEdit(): void {
    const user = this.user();
    if (!user) return;

    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.editing()) {
      this.form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate.slice(0, 10),
        password: '',
      });
    }
    this.editing.update((value) => !value);
  }

  save(): void {
    const user = this.user();
    if (!user || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload: UpdateUserInput = {
      firstName: raw.firstName,
      lastName: raw.lastName,
      birthDate: raw.birthDate,
      ...(raw.password && { password: raw.password }),
    };

    this.errorMessage.set('');
    this.saving.set(true);

    this.usersService.update(user.id, payload).subscribe({
      next: (updated) => {
        this.auth.setCurrentUser(updated);
        this.saving.set(false);
        this.editing.set(false);
        this.successMessage.set('Perfil actualizado');
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.errorMessage.set(messageOf(error));
      },
    });
  }
}
