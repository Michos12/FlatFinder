import { Router } from "express";
import {
  addMessage,
  getAllMessages,
  getUserMessages
} from "../controllers/message.controller";
import { verifyToken } from "../middleware/authVerifyToken";
const router = Router();

router.get("/", verifyToken, getAllMessages);
router.post("/", verifyToken, addMessage);
router.get("/:senderId", verifyToken, getUserMessages);

export default router;