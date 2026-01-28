import { Router } from "express";
import { AssetsController } from "../controllers/assets.controller";

export default function createAssetsRoutes(assetsController: AssetsController): Router {
    const ROUTER = Router();

    ROUTER.get("/:folder/:fileName", (req, res) => assetsController.getImage(req, res))

    return ROUTER
}