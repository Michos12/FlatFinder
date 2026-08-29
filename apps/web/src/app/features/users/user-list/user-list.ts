import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import type { User, UserRole } from '@flatfinder/types';
import { AuthService } from '../../../core/api/auth.service';
import { UsersService } from '../../../core/api/users.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-user-list',
  imports: [DatePipe],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly usersService = inject(UsersService);
  private readonly auth = inject(AuthService);

  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly roles: UserRole[] = ['guest', 'owner', 'admin'];

  constructor() {
    // This screen used to read a 'users' key from localStorage that nothing
    // ever wrote, so it always came up empty. The API serves it now, and only
    // to administrators.
    this.usersService.list().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(messageOf(error));
      },
    });
  }

  isSelf(user: User): boolean {
    return user.id === this.auth.currentUser()?.id;
  }

  changeRole(user: User, event: Event): void {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    this.usersService.updateRole(user.id, role).subscribe({
      next: (updated) =>
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u))),
      error: (error: unknown) => this.errorMessage.set(messageOf(error)),
    });
  }

  remove(user: User): void {
    if (!confirm(`Delete the account for ${user.email}? This cannot be undone.`)) return;
    this.usersService.remove(user.id).subscribe({
      next: () => this.users.update((list) => list.filter((u) => u.id !== user.id)),
      error: (error: unknown) => this.errorMessage.set(messageOf(error)),
    });
  }
}
