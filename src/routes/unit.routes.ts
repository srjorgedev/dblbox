import { Router } from "express";
import { UnitController } from "../controllers/unit.controller";

export function createUnitRoutes(controller: UnitController) {
    const router = Router();

    router.get("/all", (req, res) => controller.getAllWithPages(req, res))

    return router
}