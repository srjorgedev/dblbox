import { Router } from "express";
import { Client } from "@libsql/client";

import * as Repository from "@/v1/domain/repositories"
import * as Service from "@/v1/domain/services"
import * as Controller from "@/v1/http/controllers"

import createUnitRoutes from "./v1/http/routes/unit.routes";

export function initModules(db: Client): Router {
    const ROUTER = Router();

    const rUnit = new Repository.UnitRepo(db);
    const sUnit = new Service.UnitService(rUnit);
    const cUnit = new Controller.UnitController(sUnit);

    ROUTER.use("/unit", createUnitRoutes(cUnit));

    return ROUTER;
}