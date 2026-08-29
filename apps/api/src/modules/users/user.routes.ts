import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { requireAuth, requireRole, requireSelfOrAdmin } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import * as c from './user.controller.js';
import { loginSchema, registerSchema, updateRoleSchema, updateUserSchema } from './user.schema.js';

export const userRouter = Router();

// Publicas
userRouter.post('/register', validate(registerSchema), asyncHandler(c.registerController));
userRouter.post('/login', validate(loginSchema), asyncHandler(c.loginController));

// A partir de aqui todo exige token. Antes GET /users/:id quedaba abierta.
userRouter.use(requireAuth);

userRouter.get('/me', asyncHandler(c.meController));

// Van antes de '/:id' para que 'me' no se interprete como un identificador.
userRouter.get('/me/favorites', asyncHandler(c.listFavoritesController));
userRouter.put('/me/favorites/:flatId', asyncHandler(c.addFavoriteController));
userRouter.delete('/me/favorites/:flatId', asyncHandler(c.removeFavoriteController));
userRouter.get('/', requireRole('admin'), asyncHandler(c.listUsersController));
userRouter.get('/:id', requireSelfOrAdmin(), asyncHandler(c.getUserController));
userRouter.patch(
  '/:id',
  requireSelfOrAdmin(),
  validate(updateUserSchema),
  asyncHandler(c.updateUserController),
);
userRouter.patch(
  '/:id/role',
  requireRole('admin'),
  validate(updateRoleSchema),
  asyncHandler(c.updateUserRoleController),
);
userRouter.delete('/:id', requireSelfOrAdmin(), asyncHandler(c.deleteUserController));
