import { Router } from "express";
import {
  addMessage,
  getAllMessages,
  getUserMessages
} from "../controllers/message.controller.js";
import { verifyToken } from "../middleware/authToken.js";
import admin from "../middleware/authAdmin.js";

const router = Router();

router.get("/", verifyToken, admin, getAllMessages);
router.post("/", verifyToken, addMessage);
router.get("/:senderId", verifyToken, admin, getUserMessages);

export default router;