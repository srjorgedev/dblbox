import { authMiddleware } from "@/middlewares/auth.middleware";
import { asyncHandler } from "@/utils/asyncHandler";
import { CommentController } from "@/v1/http/controllers/comment.controller";
import { Router } from "express";

export function createCommentRoutes(controller: CommentController) {
    const ROUTER = Router()

    ROUTER.get("/all", asyncHandler((req, res, next) => controller.getAllComments(req, res)))
    ROUTER.post("/", authMiddleware, asyncHandler((req, res, next) => controller.postComment(req, res)))
    ROUTER.post("/:comment", authMiddleware, asyncHandler((req, res, next) => controller.postResponse(req, res)))

    ROUTER.patch("/:comment", authMiddleware, asyncHandler((req, res, next) => controller.updateComment(req, res)))
    ROUTER.delete("/:comment", authMiddleware, asyncHandler((req, res, next) => controller.deleteComment(req, res)))

    return ROUTER
}