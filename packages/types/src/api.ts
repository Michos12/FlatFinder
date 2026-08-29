/** Successful API envelope. */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Failed API envelope. */
export interface ApiError {
  success: false;
  error: {
    /** Stable code, safe for the frontend to compare against. */
    code: string;
    message: string;
    /** Per-field validation errors, where they apply. */
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
