import { UnitTagRepo } from "@/v1/domain/repositories/unit/unit_tag.repo";
import type * as Types from "@/types/unit.types";
import { AppError } from "@/utils/AppError";

export class UnitTagService {
    private readonly repo: UnitTagRepo;

    constructor(repo: UnitTagRepo) {
        this.repo = repo;
    }

    /**
     * Find all tags associated with a unit ID.
     * @param unit_id - The ID of the unit to search tags for.
     */
    async findByID(unit_id: string): Promise<Types.UnitTag[]> {
        if (!unit_id) {
            throw new AppError("Unit ID is required", 400);
        }

        // The repo cast to UnitTag is actually UnitTag[] because rows is an array
        const tags = await this.repo.findByID(unit_id) as unknown as Types.UnitTag[];

        if (!tags || tags.length === 0) {
            throw new AppError(`No tags found for unit: ${unit_id}`, 404);
        }

        return tags;
    }

    /**
     * Insert a single tag for a unit.
     * @param data - The unit and tag ID to insert.
     */
    async insertSingle(data: Types.UnitTag): Promise<number> {
        if (!data.unit || data.tag === undefined || data.tag === null) {
            throw new AppError("Unit ID and Tag ID are required", 400);
        }

        try {
            const rowsAffected = await this.repo.insertSingle(data);
            if (rowsAffected === 0) {
                throw new AppError("Failed to insert tag: no rows affected", 500);
            }
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Internal server error during tag insertion", 500);
        }
    }

    /**
     * Insert multiple tags at once.
     * @param data - Array of unit tags to insert.
     */
    async insertMultiple(data: Types.UnitTag[]): Promise<Types.MultipleInsert> {
        if (!Array.isArray(data) || data.length === 0) {
            throw new AppError("Tags data must be a non-empty array", 400);
        }

        // Basic validation for each item
        for (const item of data) {
            if (!item.unit || item.tag === undefined || item.tag === null) {
                throw new AppError("Invalid tag data in multiple insert", 400);
            }
        }

        try {
            return await this.repo.insertMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Internal server error during multiple tag insertion", 500);
        }
    }

    /**
     * Delete a single tag association.
     * @param data - The unit and tag ID to remove.
     */
    async deleteSingle(data: Types.TagActionRequiered): Promise<number> {
        if (!data.unit || data.tag === undefined || data.tag === null) {
            throw new AppError("Unit ID and Tag ID are required for deletion", 400);
        }

        try {
            const rowsAffected = await this.repo.deleteSingle(data);
            if (rowsAffected === 0) {
                throw new AppError("No tag association found to delete", 404);
            }
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Internal server error during tag deletion", 500);
        }
    }

    /**
     * Delete multiple tag associations.
     * @param data - Array of tags to remove.
     */
    async deleteMultiple(data: Types.TagActionRequiered[]): Promise<any> {
        if (!Array.isArray(data) || data.length === 0) {
            throw new AppError("Delete data must be a non-empty array", 400);
        }

        try {
            return await this.repo.deleteMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Internal server error during multiple tag deletion", 500);
        }
    }
}
