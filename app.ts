import { Database } from "./src/db/conn"
import "dotenv/config"

import { LangRepo } from "./src/domain/repository/lang.repo"
import { ColorRepo } from "./src/domain/repository/color.repo";
import { TagRepo } from "./src/domain/repository/tag.repo";
import { ChapterRepo } from "./src/domain/repository/chapter.repo";
import { TypeRepo } from "./src/domain/repository/type.repo";
import { RarityRepo } from "./src/domain/repository/rarity.repo";
import { TagTextsRepo } from "./src/domain/repository/tag_texts.repo";
import { TagService } from "./src/domain/service/tag.service";
import { AbilityTypeService } from "./src/domain/service/ability_type.service";
import { AbilityTypeRepo } from "./src/domain/repository/ability_type.repo";
import { ColorService } from "./src/domain/service/color.service";
import { ChapterService } from "./src/domain/service/chapter.service";
import { UnitNameRepo } from "./src/domain/repository/name.repo";
import { UnitRepo } from "./src/domain/repository/unit.repo";
import { UnitService } from "./src/domain/service/unit.service";

import { UnitController } from "./src/controllers/unit.controller";

import express, { Application } from "express"

import { createUnitRoutes } from "./src/routes/unit.routes";
import { log } from "./src/utils/log";

function main() {
    // Express app declaration and config
    const app: Application = express()
    const port = process.env.PORT || 1120

    // Database env
    const url = process.env.TURSO_URL
    const token = process.env.TURSO_TOKEN

    log(`[MAIN]: url -> ${url}  token -> ${token}`)

    // Database connection declaration
    const Conn = new Database(url, token).getConnection()

    // Controllers, Repositories & Services declaration  
    const cUnit = new UnitController(new UnitService(new UnitRepo(Conn)))

    // Routes declaration
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use("/api/unit", createUnitRoutes(cUnit))




    // Running app
    app.listen(port, ()=>{
        console.log(`Server running on port ${port}`)
    })
}

main()