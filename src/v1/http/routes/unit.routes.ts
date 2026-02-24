import { Router } from "express";
import * as Controller from "@/v1/http/controllers";
import { asyncHandler } from "@/utils/asyncHandler"; 
import { authMiddleware } from "@/middlewares/auth.middleware";

export function createUnitRoutes(
    unitController: Controller.UnitController,
    basicController: Controller.UnitBasicController,
    nameController: Controller.UnitNameController,
    colorController: Controller.UnitColorController,
    tagController: Controller.UnitTagController,
    compositeController: Controller.UnitCompositeController
) {
    const ROUTER = Router();

    // Public Routes
    ROUTER.get("/all", asyncHandler((req, res) => unitController.getUnits(req, res)));
    ROUTER.get("/:id", asyncHandler((req, res) => unitController.getUnit(req, res)));
    
    ROUTER.get("/basic/:id", asyncHandler((req, res) => basicController.getBasic(req, res)));
    ROUTER.get("/name/:id", asyncHandler((req, res) => nameController.getNames(req, res)));
    ROUTER.get("/color/:id", asyncHandler((req, res) => colorController.getColors(req, res)));
    ROUTER.get("/tag/:id", asyncHandler((req, res) => tagController.getTags(req, res)));

    // Protected Routes
    ROUTER.use(authMiddleware);

    // Composite
    ROUTER.post("/full", asyncHandler((req, res) => compositeController.createFullUnit(req, res)));
    ROUTER.patch("/full", asyncHandler((req, res) => compositeController.updateFullUnit(req, res)));

    // Basic
    ROUTER.post("/basic", asyncHandler((req, res) => basicController.createBasic(req, res)));
    ROUTER.patch("/basic", asyncHandler((req, res) => basicController.updateBasic(req, res)));
    ROUTER.delete("/basic", asyncHandler((req, res) => basicController.deleteBasic(req, res)));

    // Name
    ROUTER.post("/name", asyncHandler((req, res) => nameController.createNames(req, res)));
    ROUTER.patch("/name", asyncHandler((req, res) => nameController.updateNames(req, res)));
    ROUTER.delete("/name", asyncHandler((req, res) => nameController.deleteNames(req, res)));

    // Color
    ROUTER.post("/color", asyncHandler((req, res) => colorController.createColors(req, res)));
    ROUTER.patch("/color", asyncHandler((req, res) => colorController.updateColors(req, res)));
    ROUTER.delete("/color", asyncHandler((req, res) => colorController.deleteColors(req, res)));

    // Tag
    ROUTER.post("/tag", asyncHandler((req, res) => tagController.createTags(req, res)));
    ROUTER.delete("/tag", asyncHandler((req, res) => tagController.deleteTags(req, res)));

    return ROUTER;
}