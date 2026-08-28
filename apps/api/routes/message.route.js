import { Router } from "express";
import {
  addMessage,
  getAllMessages,
  getUserMessages
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/authToken.js";

const router = Router({ mergeParams: true });

router.get("/", verifyToken, getAllMessages);
router.post("/", verifyToken, addMessage);
router.get("/:senderId", verifyToken, getUserMessages);

export default router;