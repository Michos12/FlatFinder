import express from "express";
import { getAllUsersController, 
    getUserByIdController, 
    updateUserController, 
    deleteUserController, 
    loginController, 
    registerController 
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authToken.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/login", loginController); 
userRouter.post("/register", registerController);

// Protected routes
userRouter.get("/:id", getUserByIdController);
userRouter.patch("/:id", verifyToken("owner"), updateUserController);

// Admin-only routes
userRouter.get("/", verifyToken, getAllUsersController);
userRouter.delete("/:id", verifyToken("owner"), deleteUserController);

export { userRouter }