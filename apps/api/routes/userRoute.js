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
userRouter.post("/login", loginController); 
userRouter.post("/register", registerController);

// Protected routes
userRouter.get("/:id", verifyToken, getUserByIdController);
userRouter.put("/:id", verifyToken, updateUserController);

// Admin-only routes
userRouter.get("/", [verifyToken, admin], getAllUsersController);
userRouter.delete("/:id", [verifyToken, admin], deleteUserController);

export { userRouter }