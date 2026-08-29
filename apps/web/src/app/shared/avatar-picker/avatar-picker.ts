import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarService } from '../../core/avatar/avatar.service';

/**
 * Shows the profile picture and lets the user change it.
 *
 * Together with AvatarService this is the whole picture feature: the profile
 * page only receives the resulting URL through `avatarUrlChange` and saves it
 * with the rest of the form. Replacing the URL field with a file input later
 * means editing this component and the service, and nothing else — see the
 * migration notes in avatar.service.ts.
 */
@Component({
  selector: 'app-avatar-picker',
  imports: [FormsModule],
  templateUrl: './avatar-picker.html',
  styleUrl: './avatar-picker.css',
})
export class AvatarPicker {
  private readonly avatarService = inject(AvatarService);

  readonly avatarUrl = input<string | undefined>();
  readonly firstName = input('');
  readonly lastName = input('');
  readonly saving = input(false);

  /** Emits the URL to store; an empty string means "remove the picture". */
  readonly avatarUrlChange = output<string>();

  readonly editing = signal(false);
  readonly draft = signal('');
  readonly errorMessage = signal('');
  /** A URL can look fine and still 404, so the failure is caught on render. */
  readonly imageFailed = signal(false);

  get initials(): string {
    return this.avatarService.initialsOf(this.firstName(), this.lastName());
  }

  startEditing(): void {
    this.draft.set(this.avatarUrl() ?? '');
    this.errorMessage.set('');
    this.editing.set(true);
  }

  cancel(): void {
    this.editing.set(false);
    this.errorMessage.set('');
  }

  apply(): void {
    this.avatarService.resolve(this.draft()).subscribe({
      next: (url) => {
        this.imageFailed.set(false);
        this.editing.set(false);
        this.avatarUrlChange.emit(url);
      },
      error: (error: unknown) =>
        this.errorMessage.set(error instanceof Error ? error.message : 'Invalid image'),
    });
  }

  remove(): void {
    this.imageFailed.set(false);
    this.editing.set(false);
    this.avatarUrlChange.emit('');
  }

  onImageError(): void {
    this.imageFailed.set(true);
  }
}
