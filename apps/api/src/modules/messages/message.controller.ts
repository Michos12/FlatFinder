import type { Request, Response } from 'express';
import { ApiError } from '../../lib/ApiError.js';
import { param } from '../../lib/params.js';
import { getFlatDocument } from '../flats/flat.service.js';
import * as messageService from './message.service.js';

/** The flat id comes from the parent router thanks to mergeParams. */
function flatIdOf(req: Request): string {
  return param(req, 'id');
}

export async function listMessagesController(req: Request, res: Response) {
  const flat = await getFlatDocument(flatIdOf(req));
  const isOwner = flat.ownerId.toString() === req.user!.sub;

  // The owner sees the whole conversation for the flat; anyone else sees only
  // the messages they sent themselves.
  const messages = isOwner
    ? await messageService.listMessagesByFlat(flat.id as string)
    : await messageService.listMessagesByFlatAndSender(flat.id as string, req.user!.sub);

  res.status(200).json({ success: true, data: messages });
}

export async function createMessageController(req: Request, res: Response) {
  const flat = await getFlatDocument(flatIdOf(req));
  if (flat.ownerId.toString() === req.user!.sub) {
    throw ApiError.forbidden('You cannot message yourself about your own flat');
  }
  const message = await messageService.createMessage(
    flat.id as string,
    req.user!.sub,
    req.body.content,
  );
  res.status(201).json({ success: true, data: message });
}
