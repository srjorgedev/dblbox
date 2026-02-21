import { CommentService } from "@/v1/domain/services";
import { Request, Response } from "express";
import { CommentFrom, COMMENTS_ARRAY } from "@/types/comment.types";
import { AppError } from "@/utils/AppError";

export class CommentController {
    private readonly service: CommentService;

    constructor(commentService: CommentService) {
        this.service = commentService;
    }

    // Route -> /community/comment/all
    async getAllComments(req: Request, res: Response) {
        const from = req.query.from == undefined ? null : req.query.from as CommentFrom;
        const id = req.query.id == undefined ? null : req.query.id;

        if (from == null) throw new AppError("error", 404);
        if (id == null) throw new AppError("error", 404);
        if (!(COMMENTS_ARRAY as readonly string[]).includes(from)) throw new AppError("error", 404);

        let response;
        switch (from) {
            case "equip": response = await this.service.findByEquip(Number(id)); break;
            case "unit": response = await this.service.findByUnit(String(id)); break;
            case "user": response = await this.service.findByUser(String(id)); break;
        }

        res.status(200).json(response)
    }

    // Route -> POST /community/comment
    async postComment(req: Request, res: Response) {
        const to = (req.query.to as string as CommentFrom) || null;
        const id = (req.query.id as string) || null;

        const content = (req.body.content as string) || null;
        const user = req.body.user;

        if (!(COMMENTS_ARRAY as readonly string[]).includes(to) && to == "user") throw new AppError("error with destiny, doesn't exists", 404);
        if (!user || typeof user !== "string") throw new AppError("User required", 400);
        if (content == null) throw new AppError("error with content", 404);
        if (to == null) throw new AppError("error with destiny", 404);
        if (id == null) throw new AppError("error with comment item", 404);
        if (to === "equip" && isNaN(Number(id))) throw new AppError("Invalid equipment id", 400);

        if (content.trim().length > 1000) throw new AppError("error with content length", 404);

        let response;
        switch (to) {
            case "equip": response = await this.service.insertByEquip({ content, equipment_id: Number(id), user: user }); break;
            case "unit": response = await this.service.insertByUnit({ content, unit_id: id, user }); break;
        }

        res.status(200).json(response)
    }

    // Route -> POST /community/comment/:comment
    async postResponse(req: Request, res: Response) {
        const to = (req.query.to as string as CommentFrom) || null;
        const id = (req.query.id as string) || null;

        const comment = req.params.comment as string;
        const commentId = Number(comment);

        const content = (req.body.content as string) || null;
        const user = req.body.user;

        if (isNaN(commentId)) throw new AppError("Invalid comment id", 400);
        if (!user || typeof user !== "string") throw new AppError("User required", 400);
        if (content == null) throw new AppError("error with content", 404);
        if (to == null) throw new AppError("error with destiny", 404);
        if (id == null) throw new AppError("error with comment item", 404);
        if (!(COMMENTS_ARRAY as readonly string[]).includes(to) && to == "user") throw new AppError("error with destiny, doesn't exists", 404);
        if (to === "equip" && isNaN(Number(id))) throw new AppError("Invalid equipment id", 400);

        if (content.trim().length > 1000) throw new AppError("error with content length", 404);

        let response;
        switch (to) {
            case "equip": response = await this.service.insertResponseByEquip({ content, equipment_id: Number(id), user: user, response_to: Number(commentId) }); break;
            case "unit": response = await this.service.insertResponseByUnit({ content, unit_id: id, user, response_to: Number(commentId) }); break;
        }

        res.status(200).json(response)
    }

    // Route -> PATCH /community/comment/:comment
    async updateComment(req: Request, res: Response) {
        const comment = (req.params.comment as string) || null;
        const commentId = Number(comment);

        const content = req.body.content == undefined || req.body.content == null ? null : req.body.content as string;
        const user = req.body.user;

        if (isNaN(commentId)) throw new AppError("Invalid comment id", 400);
        if (!user || typeof user !== "string") throw new AppError("User required", 400);
        if (content == null) throw new AppError("error with content", 404);
        if (content.trim().length > 1000) throw new AppError("error with content length", 404);

        const response = await this.service.updateComment({ id: commentId, content, user });

        res.status(200).json(response)
    }

    // Route -> DELETE /community/comment/:comment
    async deleteComment(req: Request, res: Response) {
        const comment = (req.params.comment as string) || null;
        const commentId = Number(comment);
        const user = req.body.user;

        if (isNaN(commentId)) throw new AppError("Invalid comment id", 400);
        if (!user || typeof user !== "string") throw new AppError("User required", 400);

        const response = await this.service.deleteComment({ id: commentId, user });

        res.status(200).json(response)
    }
}