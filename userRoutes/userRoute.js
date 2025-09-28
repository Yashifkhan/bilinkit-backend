import express from "express";
import { loginUser, registerUser } from "../usersController/userController.js";

const usersRouter = express.Router();
usersRouter.route("/registerUser").post(registerUser)
usersRouter.route("/loginUser").post(loginUser)

export {usersRouter}

