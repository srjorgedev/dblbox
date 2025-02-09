import { equipmentControllers } from "../controllers/equipment.controllers";
import { Router } from "express";

const router = Router();

router.get("/get/all", equipmentControllers.getAll)
router.get("/get/:id", equipmentControllers.getByID)
router.get("/get/summary/all", equipmentControllers.getSummaryAll)

export default router
