import { authMiddleware } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { SuggestionController } from "@/v1/http/controllers/suggestion.controller";
import { Router } from "express";

export function createSuggestRoutes(controller: SuggestionController) {
    const ROUTER = Router();

    ROUTER.post("/:id", authMiddleware, asyncHandler((req, res, next) => controller.post(req, res)));
    ROUTER.get("/:id", asyncHandler((req, res, next) => controller.get(req, res)))

    return ROUTER;
}