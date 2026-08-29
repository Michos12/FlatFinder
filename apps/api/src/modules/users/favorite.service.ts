import type { Flat as FlatDto } from '@flatfinder/types';
import { ApiError } from '../../lib/ApiError.js';
import { Flat } from '../flats/flat.model.js';
import { toFlatDto } from '../flats/flat.service.js';
import { User } from './user.model.js';

async function loadUser(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User');
  return user;
}

export async function listFavorites(userId: string): Promise<FlatDto[]> {
  const user = await loadUser(userId);
  const flats = await Flat.find({ _id: { $in: user.favoriteFlatIds } });
  return flats.map(toFlatDto);
}

export async function addFavorite(userId: string, flatId: string): Promise<FlatDto[]> {
  const exists = await Flat.exists({ _id: flatId });
  if (!exists) throw ApiError.notFound('Flat');

  // $addToSet rather than push: calling twice does not duplicate the entry.
  await User.updateOne({ _id: userId }, { $addToSet: { favoriteFlatIds: flatId } });
  return listFavorites(userId);
}

export async function removeFavorite(userId: string, flatId: string): Promise<FlatDto[]> {
  await User.updateOne({ _id: userId }, { $pull: { favoriteFlatIds: flatId } });
  return listFavorites(userId);
}
