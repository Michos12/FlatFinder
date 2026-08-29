import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import * as c from './message.controller.js';
import { createMessageSchema } from './message.schema.js';

// mergeParams so the flat's :id is inherited from the flats router.
export const messageRouter = Router({ mergeParams: true });

messageRouter.get('/', asyncHandler(c.listMessagesController));
messageRouter.post('/', validate(createMessageSchema), asyncHandler(c.createMessageController));
