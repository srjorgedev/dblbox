import { ColorRepo } from "../repository/color.repo";
import type { TSColor, TRColor } from "../../models/color.type";

export class ColorService {
    private readonly colorRepo: ColorRepo;

    constructor(colorRepo: ColorRepo) {
        this.colorRepo = colorRepo;
    }

    async readAll(): Promise<TSColor[]> {
        const data = await this.colorRepo.readAll();
        const rows = data.rows

        const colorsMap: Map<number, TSColor> = new Map();

        for (const row of rows) {
            const color_id = Number(row["color_id"]);
            const color_name = String(row["color_name"]);
            const lang_code = String(row["lang_code"]);

            if (!colorsMap.has(color_id)) {
                colorsMap.set(color_id, { id: color_id, texts: {} });
            }

            colorsMap.get(color_id)!.texts[lang_code] = color_name;
        }

        return Array.from(colorsMap.values());
    }

    async create(color: TRColor): Promise<any> {
        return await this.colorRepo.create(color);
    }
}
