import { UnitBasicRepo } from "@/v1/domain/repositories/unit/unit_basic.repo";
import type * as Types from "@/types/unit.types";
import { AppError } from "@/utils/AppError";

export class UnitBasicService {
    private readonly repo: UnitBasicRepo;

    constructor(repo: UnitBasicRepo) {
        this.repo = repo;
    }

    async findByID(unit_id: string): Promise<Types.UnitBasicResponse> {
        if (!unit_id) throw new AppError("Unit ID is required", 400);

        const result = await this.repo.findByID(unit_id);
        if (!result || (Array.isArray(result) && result.length === 0)) {
            throw new AppError(`Unit basic data not found for ID: ${unit_id}`, 404);
        }
        return result;
    }

    async insertSingle(data: Types.UnitBasic): Promise<number> {
        if (!data._id) throw new AppError("Unit ID (_id) is required", 400);

        try {
            const rowsAffected = await this.repo.insertSingle(data);
            if (rowsAffected === 0) throw new AppError("Failed to insert unit basic data", 500);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error inserting unit basic data", 500);
        }
    }

    async insertMultiple(data: Types.UnitBasic[]): Promise<Types.MultipleInsert> {
        if (!Array.isArray(data) || data.length === 0) throw new AppError("Data must be a non-empty array", 400);

        try {
            return await this.repo.insertMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Error inserting multiple unit basic data", 500);
        }
    }

    async updateSingle(prev: Types.BasicActionRequiered, next: Types.UnitBasicUpdate): Promise<number> {
        if (!prev.unit_id) throw new AppError("Previous Unit ID is required for update", 400);

        try {
            const rowsAffected = await this.repo.updateSingle(prev, next);
            if (rowsAffected === 0) throw new AppError("No record found to update", 404);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error updating unit basic data", 500);
        }
    }

    async updateMultiple(prev: Types.BasicActionRequiered[], next: Types.UnitBasicUpdate[]): Promise<any> {
        if (prev.length !== next.length) throw new AppError("Previous and Next data arrays must have the same length", 400);

        try {
            return await this.repo.updateMultiple(prev, next);
        } catch (error: any) {
            throw new AppError(error.message || "Error updating multiple unit basic data", 500);
        }
    }

    async deleteSingle(data: Types.BasicActionRequiered): Promise<number> {
        if (!data.unit_id) throw new AppError("Unit ID is required for deletion", 400);

        try {
            const rowsAffected = await this.repo.deleteSingle(data);
            if (rowsAffected === 0) throw new AppError("No record found to delete", 404);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error deleting unit basic data", 500);
        }
    }

    async deleteMultiple(data: Types.BasicActionRequiered[]): Promise<any> {
        if (!Array.isArray(data) || data.length === 0) throw new AppError("Data must be a non-empty array", 400);

        try {
            return await this.repo.deleteMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Error deleting multiple unit basic data", 500);
        }
    }
}
