import type { Request, Response } from 'express';
import { ApiError } from '../../lib/ApiError.js';
import { param } from '../../lib/params.js';
import * as flatService from './flat.service.js';

/** Solo el propietario del piso o un admin pueden modificarlo o borrarlo. */
function assertCanManage(flat: { ownerId: { toString(): string } }, req: Request) {
  const isOwner = flat.ownerId.toString() === req.user!.sub;
  if (!isOwner && req.user!.role !== 'admin') {
    throw ApiError.forbidden('This flat does not belong to you');
  }
}

export async function listFlatsController(req: Request, res: Response) {
  const result = await flatService.listFlats(req.query as never);
  res.status(200).json({ success: true, data: result });
}

export async function listMyFlatsController(req: Request, res: Response) {
  const flats = await flatService.listFlatsByOwner(req.user!.sub);
  res.status(200).json({ success: true, data: flats });
}

export async function getFlatController(req: Request, res: Response) {
  const flat = await flatService.getFlatById(param(req, 'id'));
  res.status(200).json({ success: true, data: flat });
}

export async function createFlatController(req: Request, res: Response) {
  const flat = await flatService.createFlat(req.body, req.user!.sub);
  res.status(201).json({ success: true, data: flat });
}

export async function updateFlatController(req: Request, res: Response) {
  const flat = await flatService.getFlatDocument(param(req, 'id'));
  assertCanManage(flat, req);
  const updated = await flatService.updateFlat(flat, req.body);
  res.status(200).json({ success: true, data: updated });
}

export async function deleteFlatController(req: Request, res: Response) {
  const flat = await flatService.getFlatDocument(param(req, 'id'));
  assertCanManage(flat, req);
  await flatService.deleteFlat(flat.id as string);
  res.status(204).send();
}
