import { Client } from "@libsql/client";
import { Router } from "express";

import { TABLES_ARRAY } from "@/types/data.types";

import * as Repository from "@/v1/domain/repositories";
import * as Service from "@/v1/domain/services";
import * as Controller from "@/v1/http/controllers";
import * as Routes from "@/v1/http/routes";

export function initModules(db: Client): Router {
    const ROUTER = Router();

    const rUnit = new Repository.UnitRepo(db);
    const sUnit = new Service.UnitService(rUnit);
    const cUnit = new Controller.UnitController(sUnit);

    const rEquip = new Repository.EquipRepo(db);
    const sEquip = new Service.EquipService(rEquip);
    const cEquip = new Controller.EquipController(sEquip);

    const rComment = new Repository.CommentRepo(db);
    const sComment = new Service.CommentService(rComment);
    const cComment = new Controller.CommentController(sComment);

    for (const table of TABLES_ARRAY) {
        const repo = new Repository.DataRepo(db, table);
        const service = new Service.DataService(repo);
        const controller = new Controller.DataController(service);
        ROUTER.use(`/data/${table}`, Routes.createDataRoutes(controller));
    }

    ROUTER.use("/community/comment", Routes.createCommentRoutes(cComment))
    ROUTER.use("/unit", Routes.createUnitRoutes(cUnit));
    ROUTER.use("/equip", Routes.createEquipRoutes(cEquip))

    return ROUTER;
}