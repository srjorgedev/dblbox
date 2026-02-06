import { Router } from "express";
import {
    ChapterController,
    ColorController,
    RarityController,
    TagController,
    TypeController
} from "@/http/controllers";
import { asyncHandler } from "@/utils/asyncHandler";

export default function createDataRoutes(
    chapterController: ChapterController,
    colorController: ColorController,
    rarityController: RarityController,
    typeController: TypeController,
    tagController: TagController
) {
    const ROUTER = Router();

    ROUTER.get("/chapter/all", asyncHandler((req, res, next) => chapterController.getAllChapters(req, res)));
    ROUTER.get("/chapter/:id", asyncHandler((req, res, next) => chapterController.getChapter(req, res)));

    ROUTER.get("/color/all", asyncHandler((req, res, next) => colorController.getAllColors(req, res)));
    ROUTER.get("/color/:id", asyncHandler((req, res, next) => colorController.getColor(req, res)));

    ROUTER.get("/rarity/all", asyncHandler((req, res, next) => rarityController.getAllRarities(req, res)));
    ROUTER.get("/rarity/:id", asyncHandler((req, res, next) => rarityController.getRarity(req, res)));

    ROUTER.get("/type/all", asyncHandler((req, res, next) => typeController.getAllTypes(req, res)));
    ROUTER.get("/type/:id", asyncHandler((req, res, next) => typeController.getType(req, res)));

    ROUTER.get("/tag/all", asyncHandler((req, res, next) => tagController.getAllTags(req, res)));

    return ROUTER;
}
