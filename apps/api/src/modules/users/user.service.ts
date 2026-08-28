import jwt, { type SignOptions } from 'jsonwebtoken';
import type { RegisterInput, User as UserDto, UserRole } from '@flatfinder/types';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/ApiError.js';
import { User, type UserDocument } from './user.model.js';

export function toUserDto(doc: UserDocument): UserDto {
  return {
    id: doc.id as string,
    email: doc.email,
    firstName: doc.firstName,
    lastName: doc.lastName,
    birthDate: doc.birthDate.toISOString(),
    role: doc.role,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

function signToken(doc: UserDocument): string {
  return jwt.sign({ sub: doc.id as string, role: doc.role }, env.SECRET_KEY, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as SignOptions);
}

export async function register(input: RegisterInput) {
  const exists = await User.exists({ email: input.email });
  if (exists) throw ApiError.conflict('Ya existe una cuenta con ese email');

  // El rol se fija en el servidor. Nunca se toma del cuerpo de la peticion.
  const user = await User.create({ ...input, role: 'guest' satisfies UserRole });
  return { user: toUserDto(user), token: signToken(user) };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');

  // Mismo error y mismo coste aproximado tanto si el email no existe como si
  // la contrasena no coincide: de lo contrario la API permite enumerar cuentas.
  const valid = user ? await user.comparePassword(password) : false;
  if (!user || !valid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email o contrasena incorrectos');
  }

  return { user: toUserDto(user), token: signToken(user) };
}

export async function listUsers(): Promise<UserDto[]> {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(toUserDto);
}

export async function getUserById(id: string): Promise<UserDto> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('Usuario');
  return toUserDto(user);
}

export async function updateUser(
  id: string,
  input: { firstName?: string; lastName?: string; birthDate?: Date; password?: string },
): Promise<UserDto> {
  // Se carga y se guarda el documento, en lugar de findByIdAndUpdate, para que
  // el hook pre('save') hashee la contrasena cuando venga en la peticion.
  const user = await User.findById(id).select('+password');
  if (!user) throw ApiError.notFound('Usuario');

  Object.assign(user, input);
  await user.save();
  return toUserDto(user);
}

export async function updateUserRole(id: string, role: UserRole): Promise<UserDto> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('Usuario');
  user.role = role;
  await user.save();
  return toUserDto(user);
}

export async function deleteUser(id: string): Promise<void> {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Usuario');
}
