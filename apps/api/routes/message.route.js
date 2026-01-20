import { Router } from "express";
import {
  addMessage,
  getAllMessages,
  getUserMessages
} from "../asuka/controllers/message.controller.js";
import { verifyToken } from "../asuka/middleware/authVerifyToken.js";
const router = Router();

router.get("/", verifyToken, getAllMessages);
router.post("/", verifyToken, addMessage);
router.get("/:senderId", verifyToken, getUserMessages);

export default router;