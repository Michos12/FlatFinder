import { z } from 'zod';

/**
 * A URL restricted to http(s).
 *
 * Zod's `.url()` only checks that `new URL()` parses the string, so it happily
 * accepts `javascript:alert(1)` and `data:` payloads. Every URL this API
 * stores ends up in an `<img src>` somewhere, so the scheme is pinned here.
 */
export function httpUrl(message: string) {
  return z
    .string()
    .trim()
    .url(message)
    .refine((value) => /^https?:\/\//i.test(value), message);
}
