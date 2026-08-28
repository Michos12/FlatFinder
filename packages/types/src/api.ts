/** Envoltorio de exito de la API. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Envoltorio de error de la API. */
export interface ApiError {
  success: false;
  error: {
    /** Codigo estable, apto para comparar en el frontend. */
    code: string;
    message: string;
    /** Errores de validacion por campo, cuando aplican. */
    details?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
