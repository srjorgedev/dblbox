import { Router } from "express";
import { hasSessionController, logInController, signOutController } from "../controllers/auth.controllers"

const router = Router()

router.post("/login", logInController)
router.post("/logout", signOutController)
router.get("/check", hasSessionController)


export default router