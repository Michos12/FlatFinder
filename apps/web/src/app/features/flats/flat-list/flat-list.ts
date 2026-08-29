import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, startWith, switchMap, tap } from 'rxjs';
import type { Flat, FlatQuery, Paginated } from '@flatfinder/types';
import { FlatsService } from '../../../core/api/flats.service';
import { UsersService } from '../../../core/api/users.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';
import { FlatCard } from '../../../shared/flat-card/flat-card';

const EMPTY_PAGE: Paginated<Flat> = { items: [], total: 0, page: 1, limit: 0 };

@Component({
  selector: 'app-flat-list',
  imports: [ReactiveFormsModule, RouterLink, FlatCard],
  templateUrl: './flat-list.html',
  styleUrl: './flat-list.css',
})
export class FlatList {
  private readonly fb = inject(FormBuilder);
  private readonly flatsService = inject(FlatsService);
  private readonly usersService = inject(UsersService);

  readonly errorMessage = signal('');
  readonly loading = signal(true);
  readonly favoriteIds = signal<ReadonlySet<string>>(new Set());

  readonly filters = this.fb.nonNullable.group({
    city: '',
    maxPrice: '',
    minArea: '',
    sortBy: 'createdAt',
    order: 'desc',
  });

  /**
   * The listing recomputes itself whenever the filters change. The debounce
   * avoids one request per keystroke while typing a city, and the catchError
   * sits inside the switchMap so a failure does not kill the stream: if it
   * broke here, the filters would stop responding for good.
   */
  private readonly page = toSignal(
    this.filters.valueChanges.pipe(
      startWith(this.filters.getRawValue()),
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      switchMap(() => {
        this.loading.set(true);
        this.errorMessage.set('');
        return this.flatsService.list(this.toQuery()).pipe(
          catchError((error: unknown) => {
            this.errorMessage.set(messageOf(error));
            return of(EMPTY_PAGE);
          }),
        );
      }),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: EMPTY_PAGE },
  );

  readonly flats = () => this.page().items;
  readonly total = () => this.page().total;

  constructor() {
    // Favourites are loaded once so each card can be marked.
    this.usersService
      .listFavorites()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (favorites) => this.favoriteIds.set(new Set(favorites.map((f) => f.id))),
        error: () => this.favoriteIds.set(new Set()),
      });
  }

  private toQuery(): FlatQuery {
    const raw = this.filters.getRawValue();
    return {
      ...(raw.city && { city: raw.city }),
      ...(raw.maxPrice && { maxPrice: Number(raw.maxPrice) }),
      ...(raw.minArea && { minArea: Number(raw.minArea) }),
      sortBy: raw.sortBy as FlatQuery['sortBy'],
      order: raw.order as FlatQuery['order'],
      limit: 24,
    };
  }

  isFavorite(flat: Flat): boolean {
    return this.favoriteIds().has(flat.id);
  }

  toggleFavorite(flat: Flat): void {
    const request = this.isFavorite(flat)
      ? this.usersService.removeFavorite(flat.id)
      : this.usersService.addFavorite(flat.id);

    request.subscribe({
      next: (favorites) => this.favoriteIds.set(new Set(favorites.map((f) => f.id))),
      error: (error: unknown) => this.errorMessage.set(messageOf(error)),
    });
  }
}
