export interface Flat {
  id: string;
  city: string;
  streetName: string;
  streetNumber: number;
  /** Superficie en metros cuadrados. */
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  /** Precio mensual de alquiler. */
  rentPrice: number;
  /** Fecha de disponibilidad, ISO 8601. */
  dateAvailable: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateFlatInput = Omit<
  Flat,
  'id' | 'ownerId' | 'createdAt' | 'updatedAt'
>;

export type UpdateFlatInput = Partial<CreateFlatInput>;

/** Filtros aceptados por GET /flats. */
export interface FlatQuery {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  hasAC?: boolean;
  sortBy?: 'city' | 'rentPrice' | 'areaSize' | 'createdAt';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
