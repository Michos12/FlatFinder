import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { messageRouter } from '../messages/message.routes.js';
import * as c from './flat.controller.js';
import { createFlatSchema, flatQuerySchema, updateFlatSchema } from './flat.schema.js';

export const flatRouter = Router();

flatRouter.use(requireAuth);

flatRouter.get('/', validate(flatQuerySchema, 'query'), asyncHandler(c.listFlatsController));
flatRouter.get('/mine', asyncHandler(c.listMyFlatsController));
flatRouter.post('/', validate(createFlatSchema), asyncHandler(c.createFlatController));
flatRouter.get('/:id', asyncHandler(c.getFlatController));
flatRouter.patch('/:id', validate(updateFlatSchema), asyncHandler(c.updateFlatController));
flatRouter.delete('/:id', asyncHandler(c.deleteFlatController));

// Messages hang off a flat: /flats/:id/messages
flatRouter.use('/:id/messages', messageRouter);
