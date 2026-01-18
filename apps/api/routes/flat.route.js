import { Router } from "express";
import {
  addFlat,
  getAllFlats,
  getFlatById,
  updateFlat,
  deleteFlat
} from "../controllers/flat.controller.js";
import { verifyToken } from "../middleware/authVerifyToken.js";
const router = Router();

router.get("/", verifyToken, getAllFlats);
router.patch("/:id", verifyToken, updateFlat);
router.delete("/:id", verifyToken, deleteFlat);
router.post("/", verifyToken, addFlat);
router.get("/:id", verifyToken, getFlatById);


export default router;