import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";

import {
  loginUser,
  logout,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controllers.js";

const userRoutes = Router();

userRoutes.route("/register").post(registerUser);
userRoutes.route("/login").post(loginUser);
userRoutes.route("/details").put(verifyJWT, updateUserDetails);
userRoutes.route("/logout").get(verifyJWT, logout);

export default userRoutes;
