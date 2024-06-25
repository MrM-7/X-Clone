import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { getUserProfile, toggleFollow } from "../controllers/user.controller.js";

const router = Router()

router.use(verifyToken)   // this will run for all routes in this file

router
.route("/profile/:username")
.get(getUserProfile)

router
.route("/toggle-follow/:id")
.post(toggleFollow)

export default router