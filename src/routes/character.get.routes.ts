import { Router } from 'express';
import { characterGetController } from "../controllers/character.controllers";

const router = Router();

router.get("/get/summary/all", characterGetController.getSummary);
router.get("/get/:idNUM", characterGetController.getById);
router.get("/get/summary/refresh", characterGetController.refreshSummary);
router.get("/get/summary/rarity/:rar", characterGetController.getSummaryByRarity)
router.get("/get/summary/ll", characterGetController.getSummaryByIsLL)
router.get("/get/summary/zenkai", characterGetController.getSummaryByZenkai)
router.get("/get/summary/ll-zenkai", characterGetController.getSummaryByLLZenkai)

// router.post("/update/:idNUM", characterController.updateCharacter)

export default router;