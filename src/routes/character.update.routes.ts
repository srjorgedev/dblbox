import { Router } from 'express';
import { characterUpdateController } from '../controllers/character.controllers';
// import { authenticateToken } from '../middleware/authToken';

const router = Router();

router.patch("/update/arts/:idNUM", characterUpdateController.updateArts)
router.patch("/update/zarts/:idNUM", characterUpdateController.updateZenkaiArts)
router.patch("/update/abilities/:idNUM", characterUpdateController.updateAbilities)
router.patch("/update/zabilities/:idNUM", characterUpdateController.updateZenkaiAbilities)
router.patch("/update/basic/:idNUM", characterUpdateController.updateBasic)
router.patch("/update/all/:idNUM", characterUpdateController.updateAll)

export default router;