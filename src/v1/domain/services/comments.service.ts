import { CommentRepo } from "@/v1/domain/repositories/comments.repo";
import * as Types from "@/types/comment.types";

export class CommentService {
    private readonly repo: CommentRepo;

    constructor(repo: CommentRepo) {
        this.repo = repo;
    }

    async insertByEquip(data: Types.InsertByEquip) {
        const affected = await this.repo.insertByEquip(data.content, data.user, data.equipment_id);
        return {
            success: affected > 0,
            message: affected > 0 ? "Comment posted successfully" : "Failed to post comment",
            affected
        };
    }

    async insertByUnit(data: Types.InsertByUnit) {
        const affected = await this.repo.insertByUnit(data.content, data.user, data.unit_id);
        return {
            success: affected > 0,
            message: affected > 0 ? "Comment posted successfully" : "Failed to post comment",
            affected
        };
    }

    async insertResponseByEquip(data: Types.ResponseByEquip) {
        const affected = await this.repo.insertResponseByEquip(data.content, data.user, data.equipment_id, data.response_to);
        return {
            success: affected > 0,
            message: affected > 0 ? "Response posted successfully" : "Failed to post response",
            affected
        };
    }

    async insertResponseByUnit(data: Types.ResponseByUnit) {
        const affected = await this.repo.insertResponseByUnit(data.content, data.user, data.unit_id, data.response_to);
        return {
            success: affected > 0,
            message: affected > 0 ? "Response posted successfully" : "Failed to post response",
            affected
        };
    }

    async updateComment(data: Types.UpdateComment) {
        const affected = await this.repo.updateComment(data.content, data.id, data.user);
        return {
            success: affected > 0,
            message: affected > 0 ? "Comment updated successfully" : "Failed to update comment (maybe it doesn't exist or you're not the owner)",
            affected
        };
    }

    async deleteComment(data: Types.DeleteComment) {
        const affected = await this.repo.deleteComment(data.id, data.user);
        return {
            success: affected > 0,
            message: affected > 0 ? "Comment deleted successfully" : "Failed to delete comment (maybe it doesn't exist or you're not the owner)",
            affected
        };
    }

    async findByUnit(unit: string): Promise<Types.APIResponse<Types.CommentWithAnswers>> {
        const r = await this.repo.findByUnit(unit);
        const data: Types.Comment[] = r.map(data => JSON.parse(data.data));

        const grouped = this.groupComments(data);
        return {
            meta: {
                count: r.length
            },
            data: grouped
        }
    }

    async findByEquip(equip: number): Promise<Types.APIResponse<Types.CommentWithAnswers>> {
        const r = await this.repo.findByEquip(equip);
        const data: Types.Comment[] = r.map(data => JSON.parse(data.data));

        const grouped = this.groupComments(data);
        return {
            meta: {
                count: r.length
            },
            data: grouped
        }
    }

    // TODO: Move function to utils
    private groupComments(comments: Types.Comment[]): Types.CommentWithAnswers[] {
        const commentMap = new Map<number, Types.CommentWithAnswers>();
        const roots: Types.CommentWithAnswers[] = [];

        const sortedComments = [...comments].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        sortedComments.forEach(comment => {
            commentMap.set(comment.id, {
                ...comment,
                answers: []
            });
        });

        sortedComments.forEach(comment => {
            const node = commentMap.get(comment.id)!;

            if (comment.response_to && commentMap.has(comment.response_to)) {
                const parent = commentMap.get(comment.response_to)!;
                parent.answers.push(node);

                parent.answers.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                );
            } else {
                roots.push(node);
            }
        });

        return roots;
    }
    async findByUser(user: string) {
        const r = await this.repo.findByUser(user);

        return {
            meta: {
                count: r.length
            },
            data: r
        }
    }
}