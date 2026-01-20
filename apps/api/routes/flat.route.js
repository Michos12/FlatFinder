import { Router } from "express";
import {
  addFlat,
  getAllFlats,
  getFlatById,
  updateFlat,
  deleteFlat
} from "../controllers/flat.controller.js";
import { verifyToken } from "../middleware/authToken.js";
import admin from "../middleware/authAdmin.js";
const router = Router();

router.get("/", verifyToken, getAllFlats);
router.patch("/:id", verifyToken, admin, updateFlat);
router.delete("/:id", verifyToken, admin, deleteFlat);
router.post("/", verifyToken, admin, addFlat);
router.get("/:id", verifyToken, getFlatById);


export default router;