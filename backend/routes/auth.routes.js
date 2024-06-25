import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = Router()

router
.route("/me")
.get(verifyToken, getMe)

router
.route("/signup")
.post(signup)

router
.route("/login")
.post(login)

router
.route("/logout")
.post(logout)

export default router