import type { Request, Response } from 'express';
import { ApiError } from '../../lib/ApiError.js';
import { param } from '../../lib/params.js';
import { getFlatDocument } from '../flats/flat.service.js';
import * as messageService from './message.service.js';

/** El id del piso llega del router padre gracias a mergeParams. */
function flatIdOf(req: Request): string {
  return param(req, 'id');
}

export async function listMessagesController(req: Request, res: Response) {
  const flat = await getFlatDocument(flatIdOf(req));
  const isOwner = flat.ownerId.toString() === req.user!.sub;

  // El propietario ve toda la conversacion del piso; cualquier otro usuario
  // ve unicamente los mensajes que ha enviado el mismo.
  const messages = isOwner
    ? await messageService.listMessagesByFlat(flat.id as string)
    : await messageService.listMessagesByFlatAndSender(flat.id as string, req.user!.sub);

  res.status(200).json({ success: true, data: messages });
}

export async function createMessageController(req: Request, res: Response) {
  const flat = await getFlatDocument(flatIdOf(req));
  if (flat.ownerId.toString() === req.user!.sub) {
    throw ApiError.forbidden('No puedes enviarte un mensaje sobre tu propio piso');
  }
  const message = await messageService.createMessage(
    flat.id as string,
    req.user!.sub,
    req.body.content,
  );
  res.status(201).json({ success: true, data: message });
}
