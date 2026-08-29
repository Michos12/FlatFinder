/** System roles, in increasing order of permission. */
export const USER_ROLES = ['guest', 'owner', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * A user as the API returns it.
 * The password never leaves the backend, which is why it is absent here.
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Fields a user may change on their own profile. */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  password?: string;
}

/** Only an admin may change another user's role. */
export interface AdminUpdateUserInput extends UpdateUserInput {
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}
