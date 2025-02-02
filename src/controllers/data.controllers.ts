import { Request, Response } from "express";
import { getTag, getChapter, getColor, getRarity, getType } from "../services/data.services";

async function getAllController(_: Request, res: Response): Promise<Response> {
    try {
        const color = getColor()
        const type = getType()
        const tag = getTag()
        const chapter = getChapter()
        const rarity = getRarity()

        const data = await Promise.all([color, type, tag, chapter, rarity])

        return res.json({
            color: data[0],
            type: data[1],
            tag: data[2],
            chapter: data[3],
            rarity: data[4]
        })
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
}

async function getTagController(_: Request, res: Response): Promise<Response> {
    try {
        const data = await getTag()
        return res.json({ data })
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
}

async function getTypeController(_: Request, res: Response): Promise<Response> {
    try {
        const data = await getType()
        return res.json({ data })
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
}

async function getColorController(_: Request, res: Response): Promise<Response> {
    try {
        const data = await getColor()
        return res.json({ data })
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
}

async function getRarityController(_: Request, res: Response): Promise<Response> {
    try {
        const data = await getRarity()
        return res.json({ data })
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
}

async function getChapterController(_: Request, res: Response): Promise<Response> {
    try {
        const data = await getChapter()
        return res.json({ data })
    } catch (error) {
        return res.json({ error: (error as Error).message })
    }
}

export const dataControllers = {
    getTagController,
    getChapterController,
    getColorController,
    getTypeController,
    getRarityController,
    getAllController,
}