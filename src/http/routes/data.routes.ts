import { Router } from "express";
import {
    ChapterController,
    ColorController,
    RarityController,
    TagController,
    TypeController
} from "../controllers";

export default function createDataRoutes(
    chapterController: ChapterController,
    colorController: ColorController,
    rarityController: RarityController,
    typeController: TypeController,
    tagController: TagController
) {
    const ROUTER = Router();

    ROUTER.get("/chapter/all", (req, res) => chapterController.getAllChapters(req, res));
    ROUTER.get("/chapter/:id", (req, res) => chapterController.getChapter(req, res));

    ROUTER.get("/color/all", (req, res) => colorController.getAllColors(req, res));
    ROUTER.get("/color/:id", (req, res) => colorController.getColor(req, res));

    ROUTER.get("/rarity/all", (req, res) => rarityController.getAllRarities(req, res));
    ROUTER.get("/rarity/:id", (req, res) => rarityController.getRarity(req, res));

    ROUTER.get("/type/all", (req, res) => typeController.getAllTypes(req, res));
    ROUTER.get("/type/:id", (req, res) => typeController.getType(req, res));

    ROUTER.get("/tag/all", (req, res) => tagController.getAllTags(req, res));

    return ROUTER;
}
