import { Component, input } from '@angular/core';
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
}
