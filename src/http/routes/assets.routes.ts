import { Router } from "express";
import { AssetsController } from "@/http/controllers/assets.controller";
import { asyncHandler } from "@/utils/asyncHandler";

export default function createAssetsRoutes(assetsController: AssetsController): Router {
    const ROUTER = Router();

    ROUTER.get("/:folder/:fileName", asyncHandler((req, res, next) => assetsController.getImage(req, res)))

    return ROUTER
}