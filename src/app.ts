import Database from "./db/connection";
import { UnitRepo } from "./domain/repository/unit.repo";
import { TagRepo } from "./domain/repository/tag.repo";
import { UnitService } from "./domain/service/unit.service";
import { UnitController } from "./http/controllers/unit.controller";
import { EquipRepo } from "./domain/repository/equip.repo";
import { AssetsRepo } from "./domain/repository/assets.repo";
import { AssetsService } from "./domain/service/assets.service";
import { AssetsController } from "./http/controllers/assets.controller";

import createUnitRoutes from "./http/routes/unit.routes";
import createAssetsRoutes from "./http/routes/assets.routes";

import e from "express";

import path from 'path';

async function app() {
    const PORT = process.env.PORT || 1110
    const db_url: string = `file:${path.join(process.cwd(), 'data', 'db', 'dblbox.db')}`;

    const conn = new Database(db_url).getConnection();

    const unitController = new UnitController(new UnitService(new UnitRepo(conn)));
    const assetsController = new AssetsController(new AssetsService(new AssetsRepo()));

    const equipRepo = new EquipRepo(conn);

    const server = e()

    server.use("/api/v1/unit", createUnitRoutes(unitController))
    server.use("/api/v1/assets", createAssetsRoutes(assetsController))

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
}

app()

