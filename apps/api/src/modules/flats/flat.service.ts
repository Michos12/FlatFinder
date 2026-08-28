import type { FilterQuery } from 'mongoose';
import type { Flat as FlatDto, Paginated } from '@flatfinder/types';
import { ApiError } from '../../lib/ApiError.js';
import { Flat, type FlatDoc, type FlatDocument } from './flat.model.js';

type FlatQuery = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  hasAC?: boolean;
  sortBy: 'city' | 'rentPrice' | 'areaSize' | 'createdAt';
  order: 'asc' | 'desc';
  page: number;
  limit: number;
};

export function toFlatDto(doc: FlatDocument): FlatDto {
  return {
    id: doc.id as string,
    city: doc.city,
    streetName: doc.streetName,
    streetNumber: doc.streetNumber,
    areaSize: doc.areaSize,
    hasAC: doc.hasAC,
    yearBuilt: doc.yearBuilt,
    rentPrice: doc.rentPrice,
    dateAvailable: doc.dateAvailable.toISOString(),
    description: doc.description,
    imageUrl: doc.imageUrl,
    ownerId: doc.ownerId.toString(),
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function buildFilter(q: FlatQuery): FilterQuery<FlatDoc> {
  const filter: FilterQuery<FlatDoc> = {};
  // Escapamos la entrada antes de construir la expresion regular: sin esto,
  // una busqueda con metacaracteres puede degradar la consulta.
  if (q.city) filter.city = new RegExp(q.city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.rentPrice = {
      ...(q.minPrice !== undefined && { $gte: q.minPrice }),
      ...(q.maxPrice !== undefined && { $lte: q.maxPrice }),
    };
  }
  if (q.minArea !== undefined || q.maxArea !== undefined) {
    filter.areaSize = {
      ...(q.minArea !== undefined && { $gte: q.minArea }),
      ...(q.maxArea !== undefined && { $lte: q.maxArea }),
    };
  }
  if (q.hasAC !== undefined) filter.hasAC = q.hasAC;
  return filter;
}

export async function listFlats(q: FlatQuery): Promise<Paginated<FlatDto>> {
  const filter = buildFilter(q);
  const [docs, total] = await Promise.all([
    Flat.find(filter)
      .sort({ [q.sortBy]: q.order === 'asc' ? 1 : -1 })
      .skip((q.page - 1) * q.limit)
      .limit(q.limit),
    Flat.countDocuments(filter),
  ]);
  return { items: docs.map(toFlatDto), total, page: q.page, limit: q.limit };
}

export async function listFlatsByOwner(ownerId: string): Promise<FlatDto[]> {
  const docs = await Flat.find({ ownerId }).sort({ createdAt: -1 });
  return docs.map(toFlatDto);
}

/** Devuelve el documento, no el DTO: los controladores necesitan el ownerId. */
export async function getFlatDocument(id: string): Promise<FlatDocument> {
  const flat = await Flat.findById(id);
  if (!flat) throw ApiError.notFound('Piso');
  return flat;
}

export async function getFlatById(id: string): Promise<FlatDto> {
  return toFlatDto(await getFlatDocument(id));
}

export async function createFlat(
  input: Record<string, unknown>,
  ownerId: string,
): Promise<FlatDto> {
  const flat = await Flat.create({ ...input, ownerId });
  return toFlatDto(flat);
}

export async function updateFlat(
  flat: FlatDocument,
  input: Record<string, unknown>,
): Promise<FlatDto> {
  Object.assign(flat, input);
  await flat.save();
  return toFlatDto(flat);
}

export async function deleteFlat(id: string): Promise<void> {
  await Flat.findByIdAndDelete(id);
}
