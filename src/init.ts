import { Client } from "@libsql/client";
import { Router } from "express";

import { TABLES_ARRAY } from "@/types/data.types";

import * as Repository from "@/v1/domain/repositories";
import * as Service from "@/v1/domain/services";
import * as Controller from "@/v1/http/controllers";
import * as Routes from "@/v1/http/routes";

import { configureGoogle } from "./oauth/google";

export function initModules(dblDB: Client, cDB: Client): Router {
    const ROUTER = Router();

    const rUnit = new Repository.UnitRepo(dblDB);
    const sUnit = new Service.UnitService(rUnit);
    const cUnit = new Controller.UnitController(sUnit);

    const rEquip = new Repository.EquipRepo(dblDB);
    const sEquip = new Service.EquipService(rEquip);
    const cEquip = new Controller.EquipController(sEquip);

    const rComment = new Repository.CommentRepo(dblDB);
    const sComment = new Service.CommentService(rComment);
    const cComment = new Controller.CommentController(sComment);

    const rAccount = new Repository.AccountRepo(cDB);
    const rSession = new Repository.SessionRepo(cDB);
    const rUser = new Repository.UserRepo(cDB);

    const sAuth = new Service.AuthService(rUser, rAccount, rSession);

    const cAuth = new Controller.AuthController(sAuth);

    for (const table of TABLES_ARRAY) {
        const repo = new Repository.DataRepo(dblDB, table);
        const service = new Service.DataService(repo);
        const controller = new Controller.DataController(service);
        ROUTER.use(`/data/${table}`, Routes.createDataRoutes(controller));
    }

    configureGoogle(sAuth);

    ROUTER.use("/auth", Routes.createAuthRoutes(cAuth))
    ROUTER.use("/community/comment", Routes.createCommentRoutes(cComment))
    ROUTER.use("/unit", Routes.createUnitRoutes(cUnit));
    ROUTER.use("/equip", Routes.createEquipRoutes(cEquip))

    return ROUTER;
}