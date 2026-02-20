export type DBArrResponse = Record<"data", string>[];

export type Comment = {
    id: number;
    content: string;
    unit_id: string | null;
    equipment_id: number | null;
    created_at: string;
    updated_at: string;
    response_to: number | null;
    user: string;
}

export type InsertByUnit = Pick<Comment, "content" | "unit_id" | "user"> & { unit_id: string; }
export type InsertByEquip = Pick<Comment, "content" | "equipment_id" | "user"> & { equipment_id: number; }

export type ResponseByUnit = Pick<Comment, "content" | "unit_id" | "user" | "response_to"> & { unit_id: string; response_to: number; }
export type ResponseByEquip = Pick<Comment, "content" | "equipment_id" | "user" | "response_to"> & { equipment_id: number; response_to: number; }

export type DeleteComment = Pick<Comment, "id" | "user">
export type UpdateComment = Pick<Comment, "content" | "id" | "user">

export const COMMENTS_ARRAY = ["user", "unit", "equip"] as const;
export type CommentFrom = typeof COMMENTS_ARRAY[number];

export type Meta = {
    count: number;
}

export type APIResponse<T> = {
    meta: Meta;
    data: T[];
}

export type CommentWithAnswers = Comment & {
    answers: CommentWithAnswers[];
};