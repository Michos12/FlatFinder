import express from "express";
import { getAllUsersController, getUserByIdController, updateUserController, deleteUserController, loginController, registerController } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/")
.get(getAllUsersController)
.post(registerController)

userRouter.route("/:id")
.get(getUserByIdController)
.patch(updateUserController)
.delete(deleteUserController)

export { userRouter }