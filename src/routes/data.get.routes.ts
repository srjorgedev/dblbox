import { Router } from "express";
import { dataControllers } from "../controllers/data.controllers";

const router = Router()

router.get("/tag", dataControllers.getTagController)
router.get("/type", dataControllers.getTypeController)
router.get("/rarity", dataControllers.getRarityController)
router.get("/color", dataControllers.getColorController)
router.get("/chapter", dataControllers.getChapterController)
router.get("/all", dataControllers.getAllController)

export default router