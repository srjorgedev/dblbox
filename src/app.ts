import Database from "./db/connection";
import {
    AssetsRepo,
    ChapterRepo, ColorRepo,
    EquipRepo,
    RarityRepo,
    TagRepo,
    TypeRepo,
    UnitRepo
} from "./domain/repository";

import {
    AssetsService,
    ChapterService, ColorService,
    EquipService,
    RarityService,
    TagService,
    TypeService,
    UnitService
} from "./domain/service";

import {
    AssetsController,
    ChapterController, ColorController,
    EquipController,
    RarityController,
    TagController,
    TypeController,
    UnitController
} from "./http/controllers";

import createAssetsRoutes from "./http/routes/assets.routes";
import createDataRoutes from "./http/routes/data.routes";
import createUnitRoutes from "./http/routes/unit.routes";

import e from "express";
import path from 'path';
import { globalErrorHandler } from "./http/middlewares/error.middleware";

async function app() {
    const PORT = process.env.PORT || 1110
    const db_url: string = `file:${path.join(process.cwd(), 'data', 'db', 'dblbox.db')}`;

    const conn = new Database(db_url).getConnection();

    const unitController = new UnitController(new UnitService(new UnitRepo(conn)));
    const assetsController = new AssetsController(new AssetsService(new AssetsRepo()));

    const chapterController = new ChapterController(new ChapterService(new ChapterRepo(conn)));
    const colorController = new ColorController(new ColorService(new ColorRepo(conn)));
    const rarityController = new RarityController(new RarityService(new RarityRepo(conn)));
    const typeController = new TypeController(new TypeService(new TypeRepo(conn)));
    const equipController = new EquipController(new EquipService(new EquipRepo(conn)));
    const tagController = new TagController(new TagService(new TagRepo(conn)));

    const server = e()
    server.use(e.json())

    server.use("/api/v1/unit", createUnitRoutes(unitController))
    server.use("/api/v1/assets", createAssetsRoutes(assetsController))
    server.use("/api/v1/data", createDataRoutes(
        chapterController,
        colorController,
        rarityController,
        typeController,
        tagController
    ))

    server.use(globalErrorHandler);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

app()
