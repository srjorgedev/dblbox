import { Router } from 'express';
import { characterGetController } from "../controllers/character.controllers";
import { checkAuth } from '../middleware/checkAuth';

const router = Router();

router.get("/get/summary/all", characterGetController.getSummary);
router.get("/get/:idNUM", characterGetController.getById);
router.get("/get/summary/refresh", checkAuth, characterGetController.refreshSummary);

// router.post("/update/:idNUM", characterController.updateCharacter)

export default router;