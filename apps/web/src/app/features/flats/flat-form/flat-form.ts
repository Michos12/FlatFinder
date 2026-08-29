import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type { CreateFlatInput } from '@flatfinder/types';
import { FlatsService } from '../../../core/api/flats.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';

const MAX_IMAGES = 10;

@Component({
  selector: 'app-flat-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './flat-form.html',
  styleUrl: './flat-form.css',
})
export class FlatForm {
  private readonly fb = inject(FormBuilder);
  private readonly flatsService = inject(FlatsService);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');
  readonly submitting = signal(false);
  readonly currentYear = new Date().getFullYear();
  readonly maxImages = MAX_IMAGES;

  // Names match CreateFlatInput from @flatfinder/types.
  readonly form = this.fb.nonNullable.group({
    city: ['', [Validators.required]],
    streetName: ['', [Validators.required]],
    streetNumber: [null as number | null, [Validators.required, Validators.min(0)]],
    areaSize: [null as number | null, [Validators.required, Validators.min(1)]],
    hasAC: [false],
    yearBuilt: [
      null as number | null,
      [Validators.required, Validators.min(1800), Validators.max(this.currentYear)],
    ],
    rentPrice: [null as number | null, [Validators.required, Validators.min(0)]],
    dateAvailable: ['', [Validators.required]],
    description: [''],
    // A form array so an owner can list several photos; the first one becomes
    // the cover on the listing card.
    imageUrls: this.fb.nonNullable.array([this.fb.nonNullable.control('')]),
  });

  get imageUrls() {
    return this.form.controls.imageUrls;
  }

  addImage(): void {
    if (this.imageUrls.length >= MAX_IMAGES) return;
    this.imageUrls.push(this.fb.nonNullable.control(''));
  }

  removeImage(index: number): void {
    this.imageUrls.removeAt(index);
    // Always leave one field on screen, so there is something to type into.
    if (this.imageUrls.length === 0) this.addImage();
  }

  createFlat(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    // Blank rows are dropped rather than sent: the API demands a valid URL for
    // every entry, so an empty one would fail validation.
    const images = raw.imageUrls.map((url) => url.trim()).filter(Boolean);

    const payload: CreateFlatInput = {
      city: raw.city,
      streetName: raw.streetName,
      streetNumber: Number(raw.streetNumber),
      areaSize: Number(raw.areaSize),
      hasAC: raw.hasAC,
      yearBuilt: Number(raw.yearBuilt),
      rentPrice: Number(raw.rentPrice),
      dateAvailable: raw.dateAvailable,
      ...(raw.description.trim() && { description: raw.description.trim() }),
      ...(images.length > 0 && { imageUrls: images }),
    };

    this.flatsService.create(payload).subscribe({
      next: () => void this.router.navigateByUrl('/my-flats'),
      error: (error: unknown) => {
        this.submitting.set(false);
        this.errorMessage.set(messageOf(error));
      },
    });
  }
}
