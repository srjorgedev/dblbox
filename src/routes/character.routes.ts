import { Router } from 'express';
import { characterController } from "../controllers/character.controllers";
import { authenticateToken } from '../middleware/authToken';

const router = Router();

router.get("/get/summary/all", characterController.getSummary);

router.get("/get/:idNUM", characterController.getById);

router.get("/test", authenticateToken, (_, res) => {
    res.json({ message: "SI QLEROs" })
})

// router.post("/update/:idNUM", characterController.updateCharacter)

export default router;