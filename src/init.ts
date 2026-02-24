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

    const rBasic = new Repository.UnitBasicRepo(dblDB);
    const rName = new Repository.UnitNameRepo(dblDB);
    const rColor = new Repository.UnitColorRepo(dblDB);
    const rTag = new Repository.UnitTagRepo(dblDB);

    const sBasic = new Service.UnitBasicService(rBasic);
    const sName = new Service.UnitNameService(rName);
    const sColor = new Service.UnitColorService(rColor);
    const sTag = new Service.UnitTagService(rTag);

    const cBasic = new Controller.UnitBasicController(sBasic);
    const cName = new Controller.UnitNameController(sName);
    const cColor = new Controller.UnitColorController(sColor);
    const cTag = new Controller.UnitTagController(sTag);
    const cComposite = new Controller.UnitCompositeController(sBasic, sName, sColor, sTag);

    const rEquip = new Repository.EquipRepo(dblDB);
    const sEquip = new Service.EquipService(rEquip);
    const cEquip = new Controller.EquipController(sEquip);

    const rComment = new Repository.CommentRepo(cDB);
    const sComment = new Service.CommentService(rComment);
    const cComment = new Controller.CommentController(sComment, sUnit, sEquip);

    const rAccount = new Repository.AccountRepo(cDB);
    const rSession = new Repository.SessionRepo(cDB);
    const rUser = new Repository.UserRepo(cDB);

    const rSuggestion = new Repository.SuggestionRepo(cDB);
    const sSuggestion = new Service.SuggestionService(rSuggestion, rEquip, rUnit);
    const cSuggestion = new Controller.SuggestionController(sSuggestion);

    const sAuth = new Service.AuthService(rUser, rAccount, rSession);
    const cAuth = new Controller.AuthController(sAuth);

    for (const table of TABLES_ARRAY) {
        const repo = new Repository.DataRepo(dblDB, table);
        const service = new Service.DataService(repo);
        const controller = new Controller.DataController(service);
        ROUTER.use(`/data/${table}`, Routes.createDataRoutes(controller));
    }

    configureGoogle(sAuth);

    ROUTER.use("/auth", Routes.createAuthRoutes(cAuth));
    ROUTER.use("/community/comment", Routes.createCommentRoutes(cComment));
    ROUTER.use("/community/suggest", Routes.createSuggestRoutes(cSuggestion));
    ROUTER.use("/unit", Routes.createUnitRoutes(cUnit, cBasic, cName, cColor, cTag, cComposite));
    ROUTER.use("/equip", Routes.createEquipRoutes(cEquip));

    return ROUTER;
}