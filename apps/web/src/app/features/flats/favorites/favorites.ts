import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Flat } from '@flatfinder/types';
import { UsersService } from '../../../core/api/users.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';
import { FlatCard } from '../../../shared/flat-card/flat-card';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, FlatCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class Favorites {
  private readonly usersService = inject(UsersService);

  readonly flats = signal<Flat[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    // Los favoritos viven en el usuario del servidor, no en el objeto que
    // antes se serializaba entero en localStorage.
    this.usersService.listFavorites().subscribe({
      next: (flats) => {
        this.flats.set(flats);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        this.errorMessage.set(messageOf(error));
      },
    });
  }

  remove(flat: Flat): void {
    this.usersService.removeFavorite(flat.id).subscribe({
      next: (favorites) => this.flats.set(favorites),
      error: (error: unknown) => this.errorMessage.set(messageOf(error)),
    });
  }
}
