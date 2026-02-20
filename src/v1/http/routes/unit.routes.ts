import { Router } from "express";
import { UnitController } from "@/v1/http/controllers/unit.controller";
import { asyncHandler } from "@/utils/asyncHandler"; 

export function createUnitRoutes(unitController: UnitController) {
    const ROUTER = Router();

    ROUTER.get("/all", asyncHandler((req, res, next) => unitController.getUnits(req, res)));
    ROUTER.get("/:id", asyncHandler((req, res, next) => unitController.getUnit(req, res)));
    // ROUTER.post("/", asyncHandler((req, res, next) => unitController.createUnit(req, res)))
    // ROUTER.patch("/:id", asyncHandler((req, res, next) => unitController.updateUnit(req, res)))

    return ROUTER;
}