import { Router } from "express";
import { characterGetControllerV2 } from "../../controllers/character.controllers";

const router = Router();

router.get("/get/:idNUM", characterGetControllerV2.getByIdV2);

export default router;