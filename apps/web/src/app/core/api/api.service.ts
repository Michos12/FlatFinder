import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, type Observable } from 'rxjs';
import type { ApiSuccess } from '@flatfinder/types';
import { environment } from '../../../environments/environment';

type ParamValue = string | number | boolean | undefined | null;

/**
 * Envoltura fina sobre HttpClient. Su único trabajo es desenvolver el
 * `{ success, data }` que devuelve el API, para que los servicios de dominio
 * trabajen con el dato limpio. Los errores los traduce errorInterceptor.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiUrl;

  private toParams(params?: Record<string, ParamValue>): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      // Un filtro sin valor no debe viajar como cadena vacía.
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

  /** Para endpoints que responden 204 y no traen envoltorio. */
  deleteVoid(path: string): Observable<void> {
    return this.http.delete<void>(`${this.base}${path}`);
  }
}
