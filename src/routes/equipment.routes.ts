import { equipmentControllers } from "../controllers/equipment.controllers";
import { Router } from "express";

const router = Router();

router.get("/get/all", equipmentControllers.getAll)
router.get("/get/:id", equipmentControllers.getByID)

export default router
