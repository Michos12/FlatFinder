import type { Request, Response } from 'express';
import { param } from '../../lib/params.js';
import * as userService from './user.service.js';

export async function registerController(req: Request, res: Response) {
  const result = await userService.register(req.body);
  res.status(201).json({ success: true, data: result });
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  res.status(200).json({ success: true, data: result });
}

export async function meController(req: Request, res: Response) {
  const user = await userService.getUserById(req.user!.sub);
  res.status(200).json({ success: true, data: user });
}

export async function listUsersController(_req: Request, res: Response) {
  const users = await userService.listUsers();
  res.status(200).json({ success: true, data: users });
}

export async function getUserController(req: Request, res: Response) {
  const user = await userService.getUserById(param(req, 'id'));
  res.status(200).json({ success: true, data: user });
}

export async function updateUserController(req: Request, res: Response) {
  const user = await userService.updateUser(param(req, 'id'), req.body);
  res.status(200).json({ success: true, data: user });
}

export async function updateUserRoleController(req: Request, res: Response) {
  const user = await userService.updateUserRole(param(req, 'id'), req.body.role);
  res.status(200).json({ success: true, data: user });
}

export async function deleteUserController(req: Request, res: Response) {
  await userService.deleteUser(param(req, 'id'));
  res.status(204).send();
}
