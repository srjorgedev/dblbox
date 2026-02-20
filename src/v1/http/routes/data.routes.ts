import { Router } from "express";
import { DataController } from "@/v1/http/controllers";
import { asyncHandler } from "@/utils/asyncHandler";

export function createDataRoutes(controller: DataController) {
    const ROUTER = Router();

    ROUTER.get("/all", asyncHandler((req, res, next) => controller.getAll(req, res)));
    ROUTER.get("/:id", asyncHandler((req, res, next) => controller.getByID(req, res)));

    return ROUTER;
}
