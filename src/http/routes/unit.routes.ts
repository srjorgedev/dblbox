import { Router } from "express";
import { UnitController } from "../controllers/unit.controller";

export default function createUnitRoutes(unitController: UnitController) {
    const ROUTER = Router()

    ROUTER.get("/all", (req, res) => unitController.getAllUnits(req, res))
    ROUTER.get("/:id", (req, res) => unitController.getUnit(req, res))

    return ROUTER
}