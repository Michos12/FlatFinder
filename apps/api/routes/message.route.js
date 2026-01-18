import { Router } from "express";
import {
  addMessage,
  getAllMessages,
  getUserMessages
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/authVerifyToken.js";
const router = Router();

router.get("/", verifyToken, getAllMessages);
router.post("/", verifyToken, addMessage);
router.get("/:senderId", verifyToken, getUserMessages);

export default router;