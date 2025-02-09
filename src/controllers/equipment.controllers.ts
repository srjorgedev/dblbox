import { equipmentsGetServices } from "../services/equipments.get.services";
import { Request, Response } from "express";
import { RawEquipment, RawSummaryEquipment } from "../types/equip.raw";
import { getEquipsRarity } from "../services/equip.data.services";
import { FormatEquip, FormatSummaryEquip } from "../utils/equipment.format";

async function getAll(_: Request, res: Response): Promise<Response> {
    try {
        const data = await equipmentsGetServices.getAll() as RawEquipment[]
        const rar = await getEquipsRarity()

        const equips = data.map((eq) => FormatEquip(eq, rar))
        res.json(equips)
    } catch (error) {
        return res.json({ error: error, error_message: (error as Error).message })
    }
}

async function getByID(_: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = _.params
    const parsedId = parseInt(id)
    try {
        const data = await equipmentsGetServices.getByID(parsedId) as RawEquipment
        const rar = await getEquipsRarity()

        const equips = FormatEquip(data, rar)
        res.json(equips)
    } catch (error) {
        return res.json({ error: error, error_message: (error as Error).message })
    }
}

async function getSummaryAll(_: Request, res: Response): Promise<Response>  {
    try {
        const data = await equipmentsGetServices.getSummaryAll() as RawSummaryEquipment[]

        const equips = data.map((eq) => FormatSummaryEquip(eq))
        res.json(equips)
    } catch (error) {
        return res.json({ error: error, error_message: (error as Error).message })
    }
}

export const equipmentControllers = {
    getAll,
    getByID,
    getSummaryAll
}