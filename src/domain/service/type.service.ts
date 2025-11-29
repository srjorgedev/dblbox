import { TypeRepo } from "../repository/type.repo";
import type { TSType, TRType } from "../../models/type.type";

export class TypeService {
    private readonly typeRepo: TypeRepo;

    constructor(typeRepo: TypeRepo) {
        this.typeRepo = typeRepo;
    }

    async readAll(): Promise<TSType[]> {
        const data = await this.typeRepo.readAll();
        const rows = data.rows

        const typesMap: Map<number, TSType> = new Map();

        for (const row of rows) {
            const type_id = Number(row["type_id"]);
            const type_name = String(row["type_name"]);
            const lang_code = String(row["lang_code"]);

            if (!typesMap.has(type_id)) {
                typesMap.set(type_id, { id: type_id, texts: {} });
            }

            typesMap.get(type_id)!.texts[lang_code] = type_name;
        }

        return Array.from(typesMap.values());
    }

    async create(type: TRType): Promise<any> {
        return await this.typeRepo.create(type);
    }
}
