import { Component, computed, input, signal } from '@angular/core';

const PLACEHOLDER = 'assets/houses/house.jpg';

/**
 * Shows a flat's photos one at a time, with previous/next controls and dots.
 *
 * With a single image the controls disappear, and with none it falls back to
 * the placeholder, so the component behaves sensibly for a listing whose owner
 * did not upload anything.
 */
@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.html',
  styleUrl: './image-carousel.css',
})
export class ImageCarousel {
  readonly images = input<string[] | undefined>([]);
  readonly alt = input('');

  private readonly indexSignal = signal(0);

  /** Never empty: an absent list becomes the placeholder. */
  readonly slides = computed(() => {
    const images = this.images();
    return images && images.length > 0 ? images : [PLACEHOLDER];
  });

  readonly index = computed(() => {
    // The index is clamped on read rather than on write, so it stays valid
    // even if the list shrinks underneath it.
    const max = this.slides().length - 1;
    return Math.min(this.indexSignal(), max);
  });

  readonly current = computed(() => this.slides()[this.index()]!);
  readonly hasMultiple = computed(() => this.slides().length > 1);

  previous(): void {
    const total = this.slides().length;
    this.indexSignal.set((this.index() - 1 + total) % total);
  }

  next(): void {
    this.indexSignal.set((this.index() + 1) % this.slides().length);
  }

  goTo(position: number): void {
    this.indexSignal.set(position);
  }
}
