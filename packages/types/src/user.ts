/** Roles del sistema, en orden creciente de permisos. */
export const USER_ROLES = ['guest', 'owner', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Usuario tal y como lo devuelve la API.
 * La contrasena nunca sale del backend, por eso no aparece aqui.
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

/** Campos que un usuario puede modificar de su propio perfil. */
export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  password?: string;
}

/** Solo un admin puede cambiar el rol de otro usuario. */
export interface AdminUpdateUserInput extends UpdateUserInput {
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}
