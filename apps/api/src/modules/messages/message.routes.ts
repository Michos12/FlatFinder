import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import * as c from './message.controller.js';
import { createMessageSchema } from './message.schema.js';

// mergeParams para heredar el :id del piso desde el router de flats.
export const messageRouter = Router({ mergeParams: true });

messageRouter.get('/', asyncHandler(c.listMessagesController));
messageRouter.post('/', validate(createMessageSchema), asyncHandler(c.createMessageController));
