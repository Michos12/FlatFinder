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
    avatarUrl: doc.avatarUrl,
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
  if (exists) throw ApiError.conflict('An account with that email already exists');

  // The role is decided by the server. It is never read from the request body.
  const user = await User.create({ ...input, role: 'guest' satisfies UserRole });
  return { user: toUserDto(user), token: signToken(user) };
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email }).select('+password');

  // Same error and roughly the same cost whether the email does not exist or
  // the password is wrong: otherwise the API lets you enumerate accounts.
  const valid = user ? await user.comparePassword(password) : false;
  if (!user || !valid) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Incorrect email or password');
  }

  return { user: toUserDto(user), token: signToken(user) };
}

export async function listUsers(): Promise<UserDto[]> {
  const users = await User.find().sort({ createdAt: -1 });
  return users.map(toUserDto);
}

export async function getUserById(id: string): Promise<UserDto> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User');
  return toUserDto(user);
}

export async function updateUser(
  id: string,
  input: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    password?: string;
    avatarUrl?: string;
  },
): Promise<UserDto> {
  // Load and save the document rather than findByIdAndUpdate, so the
  // pre('save') hook hashes the password whenever one is supplied.
  const user = await User.findById(id).select('+password');
  if (!user) throw ApiError.notFound('User');

  // An empty avatarUrl means "remove the picture", so it is unset rather than
  // stored as an empty string.
  const { avatarUrl, ...rest } = input;
  Object.assign(user, rest);
  if (avatarUrl !== undefined) {
    user.avatarUrl = avatarUrl === '' ? undefined : avatarUrl;
  }
  await user.save();
  return toUserDto(user);
}

export async function updateUserRole(id: string, role: UserRole): Promise<UserDto> {
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound('User');
  user.role = role;
  await user.save();
  return toUserDto(user);
}

export async function deleteUser(id: string): Promise<void> {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('User');
}
