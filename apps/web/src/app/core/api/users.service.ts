import { Injectable, inject } from '@angular/core';
import type { AdminUpdateUserInput, Flat, UpdateUserInput, User, UserRole } from '@flatfinder/types';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly api = inject(ApiService);

  /** Administrators only. */
  list() {
    return this.api.get<User[]>('/users');
  }

  getById(id: string) {
    return this.api.get<User>(`/users/${id}`);
  }

  update(id: string, input: UpdateUserInput | AdminUpdateUserInput) {
    return this.api.patch<User>(`/users/${id}`, input);
  }

  updateRole(id: string, role: UserRole) {
    return this.api.patch<User>(`/users/${id}/role`, { role });
  }

  remove(id: string) {
    return this.api.deleteVoid(`/users/${id}`);
  }

  listFavorites() {
    return this.api.get<Flat[]>('/users/me/favorites');
  }

  addFavorite(flatId: string) {
    return this.api.put<Flat[]>(`/users/me/favorites/${flatId}`);
  }

  removeFavorite(flatId: string) {
    return this.api.delete<Flat[]>(`/users/me/favorites/${flatId}`);
  }
}
