export interface Flat {
  id: string;
  city: string;
  streetName: string;
  streetNumber: number;
  /** Floor area in square metres. */
  areaSize: number;
  hasAC: boolean;
  yearBuilt: number;
  /** Monthly rent. */
  rentPrice: number;
  /**
   * Availability date, ISO 8601. This is a calendar date, not an instant: it
   * is stored at UTC midnight and must be formatted in UTC, or anyone in a
   * negative offset will see the previous day.
   */
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

/** Filters accepted by GET /flats. */
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
