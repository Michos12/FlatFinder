import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

/**
 * The single seam between "the user picked a profile picture" and "the API
 * stores a URL on the user".
 *
 * Right now the user supplies the URL themselves and this service only
 * normalises and validates it, so `resolve` is synchronous work wrapped in an
 * Observable. It returns an Observable on purpose: uploading is asynchronous,
 * and having the async boundary here already means the picker component and
 * the profile page will not change when uploads arrive.
 *
 * ---------------------------------------------------------------------------
 * FUTURE: switching to file uploads
 *
 * Everything that has to change lives in this file and in AvatarPicker. The
 * plan:
 *
 *   1. Backend — add `POST /api/users/me/avatar`, accepting multipart/form-data.
 *      Use multer with `limits.fileSize` set to MAX_FILE_SIZE_BYTES below and
 *      a fileFilter restricted to ACCEPTED_MIME_TYPES. Store the file (S3,
 *      Cloudinary or GridFS — the app has no object storage yet) and answer
 *      with `{ success: true, data: { avatarUrl } }`, the URL of the stored
 *      file. Do NOT trust the client-reported MIME type: sniff the magic bytes
 *      as well, since the header is trivial to forge.
 *
 *   2. Here — add `upload(file: File): Observable<string>` that POSTs a
 *      FormData to that endpoint and returns the URL from the response. Keep
 *      `resolve` so a plain URL still works.
 *
 *   3. AvatarPicker — swap its URL text field for an `<input type="file">`,
 *      call `upload()` instead of `resolve()`, and show progress. Its inputs
 *      and outputs stay the same.
 *
 * Nothing outside those two files reads or writes the picture, so the rest of
 * the app is unaffected: `User.avatarUrl` remains a URL either way.
 * ---------------------------------------------------------------------------
 */
@Injectable({ providedIn: 'root' })
export class AvatarService {
  /** Ready for the upload path; unused while pictures are plain URLs. */
  readonly maxFileSizeBytes = 2 * 1024 * 1024;
  readonly acceptedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;

  /** Only http(s) is allowed: a data: or javascript: URL has no business here. */
  isValid(value: string): boolean {
    try {
      const url = new URL(value.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Turns whatever the picker collected into the value stored on the user.
   * An empty string is valid and means "remove the current picture".
   */
  resolve(value: string): Observable<string> {
    const trimmed = value.trim();
    if (trimmed === '') return of('');
    if (!this.isValid(trimmed)) {
      return throwError(() => new Error('Enter a valid http(s) image URL'));
    }
    return of(trimmed);
  }

  /** Initials to fall back on while a user has no picture. */
  initialsOf(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}
