import { UnitColorRepo } from "@/v1/domain/repositories/unit/unit_color.repo";
import type * as Types from "@/types/unit.types";
import { AppError } from "@/utils/AppError";

export class UnitColorService {
    private readonly repo: UnitColorRepo;

    constructor(repo: UnitColorRepo) {
        this.repo = repo;
    }

    async findByID(unit_id: string): Promise<Types.UnitColor[]> {
        if (!unit_id) throw new AppError("Unit ID is required", 400);

        const result = await this.repo.findByID(unit_id) as unknown as Types.UnitColor[];
        if (!result || result.length === 0) {
            throw new AppError(`No color data found for unit ID: ${unit_id}`, 404);
        }
        return result;
    }

    async insertSingle(data: Types.UnitColor): Promise<number> {
        if (!data.unit || data.number === undefined || data.color === undefined) {
            throw new AppError("Unit, Number, and Color are required", 400);
        }

        try {
            const rowsAffected = await this.repo.insertSingle(data);
            if (rowsAffected === 0) throw new AppError("Failed to insert unit color", 500);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error inserting unit color", 500);
        }
    }

    async insertMultiple(data: Types.UnitColor[]): Promise<Types.MultipleInsert> {
        if (!Array.isArray(data) || data.length === 0) throw new AppError("Data must be a non-empty array", 400);

        try {
            return await this.repo.insertMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Error inserting multiple unit colors", 500);
        }
    }

    async updateSingle(prev: Types.ColorActionRequiered, next: Types.UnitColorUpdate): Promise<number> {
        if (!prev.unit || prev.number === undefined) throw new AppError("Unit and Number are required for update", 400);

        try {
            const rowsAffected = await this.repo.updateSingle(prev, next);
            if (rowsAffected === 0) throw new AppError("No record found to update", 404);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error updating unit color", 500);
        }
    }

    async updateMultiple(prev: Types.ColorActionRequiered[], next: Types.UnitColorUpdate[]): Promise<any> {
        if (prev.length !== next.length) throw new AppError("Arrays must have the same length", 400);

        try {
            return await this.repo.updateMultiple(prev, next);
        } catch (error: any) {
            throw new AppError(error.message || "Error updating multiple unit colors", 500);
        }
    }

    async deleteSingle(data: Types.ColorActionRequiered): Promise<number> {
        if (!data.unit || data.number === undefined) throw new AppError("Unit and Number are required for deletion", 400);

        try {
            const rowsAffected = await this.repo.deleteSingle(data);
            if (rowsAffected === 0) throw new AppError("No record found to delete", 404);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error deleting unit color", 500);
        }
    }

    async deleteMultiple(data: Types.ColorActionRequiered[]): Promise<any> {
        if (!Array.isArray(data) || data.length === 0) throw new AppError("Data must be a non-empty array", 400);

        try {
            return await this.repo.deleteMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Error deleting multiple unit colors", 500);
        }
    }
}
