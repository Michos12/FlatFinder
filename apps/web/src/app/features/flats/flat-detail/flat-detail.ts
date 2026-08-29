import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import type { Flat, Message } from '@flatfinder/types';
import { AuthService } from '../../../core/api/auth.service';
import { FlatsService } from '../../../core/api/flats.service';
import { MessagesService } from '../../../core/api/messages.service';
import { messageOf } from '../../../core/interceptors/error.interceptor';

@Component({
  selector: 'app-flat-detail',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './flat-detail.html',
  styleUrl: './flat-detail.css',
})
export class FlatDetail {
  private readonly fb = inject(FormBuilder);
  private readonly flatsService = inject(FlatsService);
  private readonly messagesService = inject(MessagesService);
  private readonly auth = inject(AuthService);

  /** Supplied by the router thanks to withComponentInputBinding(). */
  readonly id = input.required<string>();

  readonly errorMessage = signal('');
  readonly sendError = signal('');
  readonly messages = signal<Message[]>([]);
  readonly sending = signal(false);

  readonly form = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  /**
   * The identifier is the flat's _id, not an index into an in-memory array:
   * /flat-view/3 used to point at the fourth entry of a hardcoded list.
   */
  readonly flat = toSignal<Flat | null>(
    toObservable(this.id).pipe(
      switchMap((id) =>
        this.flatsService.getById(id).pipe(
          catchError((error: unknown) => {
            this.errorMessage.set(messageOf(error));
            return of(null);
          }),
        ),
      ),
    ),
    { initialValue: null },
  );

  readonly isOwner = computed(() => {
    const flat = this.flat();
    return flat !== null && flat.ownerId === this.auth.currentUser()?.id;
  });

  constructor() {
    // The owner gets the whole conversation for the flat; anyone else only the
    // messages they sent themselves. The API is what enforces it.
    effect(() => {
      const flat = this.flat();
      if (!flat) return;
      this.messagesService.listByFlat(flat.id).subscribe({
        next: (messages) => this.messages.set(messages),
        error: () => this.messages.set([]),
      });
    });
  }

  send(): void {
    const flat = this.flat();
    if (!flat || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sendError.set('');
    this.sending.set(true);

    this.messagesService.send(flat.id, this.form.getRawValue().content).subscribe({
      next: (message) => {
        this.messages.update((list) => [...list, message]);
        this.form.reset();
        this.sending.set(false);
      },
      error: (error: unknown) => {
        this.sending.set(false);
        this.sendError.set(messageOf(error));
      },
    });
  }
}
