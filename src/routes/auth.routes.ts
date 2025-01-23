import { Router } from "express";
import { logInController } from "../controllers/auth.controllers"

const router = Router()

router.post("/login", logInController)

export default router