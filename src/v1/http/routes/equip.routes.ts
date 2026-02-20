import { Router } from "express";
import { EquipController } from "../controllers/equip.controller";
import { asyncHandler } from "@/utils/asyncHandler";

export function createEquipRoutes(controller: EquipController) {
    const ROUTER = Router();

    ROUTER.get("/all", asyncHandler((req, res, next) => controller.getEquips(req, res)));
    ROUTER.get("/:id", asyncHandler((req, res, next) => controller.getEquip(req, res)));
    // ROUTER.post("/", asyncHandler((req, res, next) => unitController.createUnit(req, res)))
    // ROUTER.patch("/:id", asyncHandler((req, res, next) => unitController.updateUnit(req, res)))

    return ROUTER;
}