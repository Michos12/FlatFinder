import { Component, computed, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import type { Flat } from '@flatfinder/types';

/**
 * Flat card. The same block was copied across the listing, my flats,
 * favourites and the detail page; here it lives once and each screen projects
 * its own actions.
 */
@Component({
  selector: 'app-flat-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './flat-card.html',
  styleUrl: './flat-card.css',
})
export class FlatCard {
  readonly flat = input.required<Flat>();

  /** The first photo is the cover; a listing without photos gets the placeholder. */
  readonly cover = computed(() => this.flat().imageUrls?.[0] ?? 'assets/houses/house.jpg');
}
