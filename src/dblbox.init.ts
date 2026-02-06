import { Router } from "express";
import { Client } from "@libsql/client";
import {
    AssetsRepo, ChapterRepo, ColorRepo, EquipRepo, RarityRepo, TagRepo, TypeRepo, UnitRepo
} from "@/domain/repository";
import {
    AssetsService, ChapterService, ColorService, EquipService, RarityService, TagService, TypeService, UnitService
} from "@/domain/service";
import {
    AssetsController, ChapterController, ColorController, EquipController, RarityController, TagController, TypeController, UnitController
} from "@/http/controllers";
import createAssetsRoutes from "@/http/routes/assets.routes";
import createDataRoutes from "@/http/routes/data.routes";
import createUnitRoutes from "@/http/routes/unit.routes";

export function initDblBoxModule(db: Client): Router {
    const router = Router();

    const unitRepo = new UnitRepo(db);
    const assetsRepo = new AssetsRepo();
    const chapterRepo = new ChapterRepo(db);
    const colorRepo = new ColorRepo(db);
    const rarityRepo = new RarityRepo(db);
    const typeRepo = new TypeRepo(db);
    const equipRepo = new EquipRepo(db);
    const tagRepo = new TagRepo(db);

    const unitService = new UnitService(unitRepo);
    const assetsService = new AssetsService(assetsRepo);
    const chapterService = new ChapterService(chapterRepo);
    const colorService = new ColorService(colorRepo);
    const rarityService = new RarityService(rarityRepo);
    const typeService = new TypeService(typeRepo);
    const equipService = new EquipService(equipRepo);
    const tagService = new TagService(tagRepo);

    const unitController = new UnitController(unitService);
    const assetsController = new AssetsController(assetsService);
    const chapterController = new ChapterController(chapterService);
    const colorController = new ColorController(colorService);
    const rarityController = new RarityController(rarityService);
    const typeController = new TypeController(typeService);
    const equipController = new EquipController(equipService);
    const tagController = new TagController(tagService);

    // Routes
    router.use("/unit", createUnitRoutes(unitController));
    router.use("/assets", createAssetsRoutes(assetsController));
    router.use("/data", createDataRoutes(
        chapterController,
        colorController,
        rarityController,
        typeController,
        tagController
    ));

    return router;
}
