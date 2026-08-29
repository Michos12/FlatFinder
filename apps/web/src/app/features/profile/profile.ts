import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { UpdateUserInput } from '@flatfinder/types';
import { AuthService } from '../../core/api/auth.service';
import { UsersService } from '../../core/api/users.service';
import { messageOf } from '../../core/interceptors/error.interceptor';
import { AvatarPicker } from '../../shared/avatar-picker/avatar-picker';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, AvatarPicker],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly usersService = inject(UsersService);

  readonly user = this.auth.currentUser;
  /** Everyone is a guest until they are not, so the role is only worth
   *  showing when it says something: an administrator badge. */
  readonly isAdmin = this.auth.isAdmin;

  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly savingAvatar = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    birthDate: ['', [Validators.required]],
    // Blank means "leave it alone". The form used to demand the password for
    // any edit and rewrite it on every save.
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

  /**
   * The picture saves on its own rather than waiting for the form, so it can
   * be changed without entering edit mode. AvatarPicker hands over a plain
   * URL, which is all this needs to know about it.
   */
  saveAvatar(avatarUrl: string): void {
    const user = this.user();
    if (!user) return;

    this.errorMessage.set('');
    this.savingAvatar.set(true);

    this.usersService.update(user.id, { avatarUrl }).subscribe({
      next: (updated) => {
        this.auth.setCurrentUser(updated);
        this.savingAvatar.set(false);
        this.successMessage.set(avatarUrl ? 'Picture updated' : 'Picture removed');
      },
      error: (error: unknown) => {
        this.savingAvatar.set(false);
        this.errorMessage.set(messageOf(error));
      },
    });
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
        this.successMessage.set('Profile updated');
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.errorMessage.set(messageOf(error));
      },
    });
  }
}
