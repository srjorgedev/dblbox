import { UnitNameRepo } from "@/v1/domain/repositories/unit/unit_name.repo";
import type * as Types from "@/types/unit.types";
import { AppError } from "@/utils/AppError";

export class UnitNameService {
    private readonly repo: UnitNameRepo;

    constructor(repo: UnitNameRepo) {
        this.repo = repo;
    }

    async findByID(unit_id: string, lang: string): Promise<Types.ServiceResponse<{ totalElements: number; lang: string }, Types.UnitName[]>> {
        if (!unit_id) throw new AppError("Unit ID is required", 400);

        const result = await this.repo.findByID(unit_id) as unknown as Types.UnitName[];
        if (!result || result.length === 0) {
            throw new AppError(`No name data found for unit ID: ${unit_id}`, 404);
        }
        
        return {
            meta: {
                totalElements: result.length,
                lang
            },
            data: result
        };
    }

    async insertSingle(data: Types.UnitName): Promise<number> {
        if (!data.unit || data.num === undefined || !data.lang || !data.content) {
            throw new AppError("Unit, Num, Lang, and Content are required", 400);
        }

        try {
            const rowsAffected = await this.repo.insertSingle(data);
            if (rowsAffected === 0) throw new AppError("Failed to insert unit name", 500);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error inserting unit name", 500);
        }
    }

    async insertMultiple(data: Types.UnitName[]): Promise<Types.MultipleInsert> {
        if (!Array.isArray(data) || data.length === 0) throw new AppError("Data must be a non-empty array", 400);

        try {
            return await this.repo.insertMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Error inserting multiple unit names", 500);
        }
    }

    async updateSingle(prev: Types.NameActionRequiered, next: Types.UnitNameUpdate): Promise<number> {
        if (!prev.unit || prev.num === undefined || !prev.lang) {
            throw new AppError("Unit, Num, and Lang are required for update", 400);
        }

        try {
            const rowsAffected = await this.repo.updateSingle(prev, next);
            if (rowsAffected === 0) throw new AppError("No record found to update", 404);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error updating unit name", 500);
        }
    }

    async updateMultiple(prev: Types.NameActionRequiered[], next: Types.UnitNameUpdate[]): Promise<any> {
        if (prev.length !== next.length) throw new AppError("Arrays must have the same length", 400);

        try {
            return await this.repo.updateMultiple(prev, next);
        } catch (error: any) {
            throw new AppError(error.message || "Error updating multiple unit names", 500);
        }
    }

    async deleteSingle(data: Types.NameActionRequiered): Promise<number> {
        if (!data.unit || data.num === undefined || !data.lang) {
            throw new AppError("Unit, Num, and Lang are required for deletion", 400);
        }

        try {
            const rowsAffected = await this.repo.deleteSingle(data);
            if (rowsAffected === 0) throw new AppError("No record found to delete", 404);
            return rowsAffected;
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            throw new AppError(error.message || "Error deleting unit name", 500);
        }
    }

    async deleteMultiple(data: Types.NameActionRequiered[]): Promise<any> {
        if (!Array.isArray(data) || data.length === 0) throw new AppError("Data must be a non-empty array", 400);

        try {
            return await this.repo.deleteMultiple(data);
        } catch (error: any) {
            throw new AppError(error.message || "Error deleting multiple unit names", 500);
        }
    }
}
