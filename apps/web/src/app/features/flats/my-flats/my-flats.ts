import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Flat } from '@flatfinder/types';
import { FlatsService } from '../../../core/api/flats.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';
import { FlatCard } from '../../../shared/flat-card/flat-card';

@Component({
  selector: 'app-my-flats',
  imports: [RouterLink, FlatCard],
  templateUrl: './my-flats.html',
  styleUrl: './my-flats.css',
})
export class MyFlats {
  private readonly flatsService = inject(FlatsService);

  readonly flats = signal<Flat[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor() {
    this.load();
  }

  private load(): void {
    // Los pisos ya no salen del objeto de usuario en localStorage: los sirve
    // el API filtrando por propietario.
    this.flatsService.listMine().subscribe({
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
    if (!confirm(`Delete the flat in ${flat.city}? This cannot be undone.`)) return;

    this.flatsService.remove(flat.id).subscribe({
      next: () => this.flats.update((list) => list.filter((f) => f.id !== flat.id)),
      error: (error: unknown) => this.errorMessage.set(messageOf(error)),
    });
  }
}
