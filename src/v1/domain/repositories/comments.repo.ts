import { Client } from "@libsql/client";
import { CommentQueries } from "@/v1/queries/comment.query";
import type * as Types from "@/types/comment.types";

export class CommentRepo {
    private readonly db: Client;

    constructor(db: Client) {
        this.db = db;
    }

    async findByUnit(unit_id: string): Promise<Types.DBArrResponse> {
        const r = await this.db.execute({
            sql: CommentQueries.selectCommentsByUnit,
            args: [unit_id]
        })

        return r.rows as unknown as Types.DBArrResponse
    }

    async findByEquip(equip_id: number): Promise<Types.DBArrResponse> {
        const r = await this.db.execute({
            sql: CommentQueries.selectCommentsByEquip,
            args: [equip_id]
        })

        return r.rows as unknown as Types.DBArrResponse
    }

    async findByUser(user: string): Promise<Types.DBArrResponse> {
        const r = await this.db.execute({
            sql: CommentQueries.selectCommentsByUser,
            args: [user]
        })

        return r.rows as unknown as Types.DBArrResponse
    }

    async insertByUnit(content: string, user: string, unit_id: string): Promise<number> {
        const r = await this.db.execute({
            sql: CommentQueries.insertUnitComment,
            args: [content, user, unit_id]
        })

        return r.rowsAffected as number
    }

    async insertByEquip(content: string, user: string, equip_id: number): Promise<number> {
        const r = await this.db.execute({
            sql: CommentQueries.insertEquipComment,
            args: [content, user, equip_id]
        })

        return r.rowsAffected as number
    }

    async insertResponseByUnit(content: string, user: string, unit_id: string, response_to: number): Promise<number> {
        const r = await this.db.execute({
            sql: CommentQueries.insertUnitCommentResponse,
            args: [content, user, unit_id, response_to]
        })

        return r.rowsAffected as number
    }

    async insertResponseByEquip(content: string, user: string, equip_id: number, response_to: number): Promise<number> {
        const r = await this.db.execute({
            sql: CommentQueries.insertEquipCommentResponse,
            args: [content, user, equip_id, response_to]
        })

        return r.rowsAffected as number
    }

    async updateComment(content: string, comment: number, user: string) {
        const r = await this.db.execute({
            sql: CommentQueries.updateComment,
            args: [content, comment, user]
        })

        return r.rowsAffected as number
    }

    async deleteComment(comment: number, user: string) {
        const r = await this.db.execute({
            sql: CommentQueries.deleteComment,
            args: [comment, user]
        })

        return r.rowsAffected as number
    }
}