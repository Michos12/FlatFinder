import express from "express";
import { getAllUsersController, 
    getUserByIdController, 
    updateUserController, 
    deleteUserController, 
    loginController, 
    registerController 
} from "../controllers/userController.js";
import admin from "../middleware/authAdmin.js";
import { verifyToken } from "../middleware/authToken.js";

const userRouter = express.Router();

// Public routes
router.post("/login", loginController); 
router.post("/register", registerController);

// Protected routes
router.get("/:id", verifyToken, getUserByIdController);
router.put("/:id", verifyToken, updateUserController);

// Admin-only routes
router.get("/", [verifyToken, admin], getAllUsersController);
router.delete("/:id", [verifyToken, admin], deleteUserController);

export { userRouter }