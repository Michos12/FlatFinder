import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import type { CreateFlatInput } from '@flatfinder/types';
import { FlatsService } from '../../../core/api/flats.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';

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
    imageUrl: [''],
  });

  createFlat(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const payload: CreateFlatInput = {
      city: raw.city,
      streetName: raw.streetName,
      streetNumber: Number(raw.streetNumber),
      areaSize: Number(raw.areaSize),
      hasAC: raw.hasAC,
      yearBuilt: Number(raw.yearBuilt),
      rentPrice: Number(raw.rentPrice),
      dateAvailable: raw.dateAvailable,
      // Optional fields are only sent when filled in: the API rejects an
      // empty imageUrl because it demands a valid URL.
      ...(raw.description.trim() && { description: raw.description.trim() }),
      ...(raw.imageUrl.trim() && { imageUrl: raw.imageUrl.trim() }),
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
