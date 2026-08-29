import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import type { ApiSuccess } from '@flatfinder/types';
import { environment } from '../../../environments/environment';

type ParamValue = string | number | boolean | undefined | null;

/**
 * A thin wrapper over HttpClient. Its only job is to unwrap the
 * `{ success, data }` envelope the API returns, so the domain services work
 * with clean data. Errors are translated by errorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  private toParams(params?: Record<string, ParamValue>): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      // A filter with no value should not travel as an empty string.
      if (value === undefined || value === null || value === '') continue;
      httpParams = httpParams.set(key, String(value));
    }
    return httpParams;
  }

  private unwrap<T>(source: Observable<ApiSuccess<T>>): Observable<T> {
    return source.pipe(map((response) => response.data));
  }

  get<T>(path: string, params?: Record<string, ParamValue>): Observable<T> {
    return this.unwrap(
      this.http.get<ApiSuccess<T>>(`${this.base}${path}`, { params: this.toParams(params) }),
    );
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.unwrap(this.http.post<ApiSuccess<T>>(`${this.base}${path}`, body ?? {}));
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.unwrap(this.http.put<ApiSuccess<T>>(`${this.base}${path}`, body ?? {}));
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.unwrap(this.http.patch<ApiSuccess<T>>(`${this.base}${path}`, body ?? {}));
  }

  delete<T>(path: string): Observable<T> {
    return this.unwrap(this.http.delete<ApiSuccess<T>>(`${this.base}${path}`));
  }

  /** For endpoints that answer 204 and carry no envelope. */
  deleteVoid(path: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${path}`);
  }
}
