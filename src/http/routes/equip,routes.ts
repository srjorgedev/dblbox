import { Router } from "express";
import { EquipController } from "@/http/controllers/equip.controller";
import { asyncHandler } from "@/utils/asyncHandler";

export default function createEquipRoutes(equipController: EquipController) {
    const ROUTER = Router();

    ROUTER.get("/all", asyncHandler((req, res, next) => equipController.getAllEquips(req, res)))
    ROUTER.get("/:id", asyncHandler((req, res, next) => equipController.getEquip(req, res)))
    ROUTER.get("/all/:id", asyncHandler((req, res, next) => equipController.getEquipsByUnitID(req, res)))   // All equips that one unit can use
    ROUTER.get("/:id/units", asyncHandler((req, res, next) => equipController.getUnitsByEquipID(req, res))) // All units that can use one equip

    return ROUTER;
}

