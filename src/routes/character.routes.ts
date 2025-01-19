import { Router } from 'express';
import { characterController } from "../controllers/character.controllers";

const router = Router();

router.get("/get/summary/all", characterController.getSummary);

router.get("/get/:idNUM", characterController.getById);

// router.post("/update/:idNUM", characterController.updateCharacter)

export default router;