import { Request, Response } from 'express';
import { getCharacter } from "../services/character.get.services";
import type { FormatedCharacter } from "../types/formated.character";
import { basicFormat, summaryFormat } from "../utils/character.format";
import { getData } from "../utils/invoque.data";
import { updateCharacter } from '../services/character.update.services';
import type { Abilities, Arts, BasicUpdateData, ZenkaiArts, ZenkaiAbilities, UpdateCharacter } from '../types/update.character';
import { validateObject } from '../utils/validateObject';

let cachedCharacters: unknown;
let lastFetchTime: number;
const CACHE_EXPIRATION_TIME: number = 60 * 60 * 1000;

let cachedCharacter: FormatedCharacter;
let lastFetchTime2: number;
const CACHE_EXPIRATION_TIME2: number = 60 * 60 * 1000;

export async function refreshSummary(_: Request, res: Response): Promise<Response> {
    const currentTime: number = Date.now();
    const data = await getData()

    const characters = await getCharacter.summaryAll();

    const formatedCharacters = characters.map((character) => summaryFormat(character, data))

    cachedCharacters = formatedCharacters;
    lastFetchTime = currentTime;

    return res.json(formatedCharacters);
}

export async function getSummary(_: Request, res: Response): Promise<Response> {
    const currentTime: number = Date.now();
    const data = await getData()

    if (cachedCharacters && (currentTime - lastFetchTime) < CACHE_EXPIRATION_TIME) {
        console.log("Usando datos de caché");
        return res.json(cachedCharacters);
    }

    const characters = await getCharacter.summaryAll();

    const formatedCharacters = characters.map((character) => summaryFormat(character, data))

    cachedCharacters = formatedCharacters;
    lastFetchTime = currentTime;

    return res.json(formatedCharacters);
}

export async function getById(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const id = parseInt(req.params.idNUM);

    let formatedCharacters;
    const currentTime: number = Date.now();
    const data = await getData()

    if (cachedCharacter && cachedCharacter.num == id && (currentTime - lastFetchTime2) < CACHE_EXPIRATION_TIME2) {
        return res.json(cachedCharacter);
    }

    try {
        const characters = await getCharacter.byNumID(id);
        formatedCharacters = basicFormat(characters, data);
    } catch (error) {
        if (error instanceof Error) return res.status(404).json({ error: error.message });
    }

    cachedCharacter = formatedCharacters
    lastFetchTime2 = currentTime

    return res.json(formatedCharacters);
}

export async function updateAll(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const { idNUM } = req.params;
    const { char }: { char: UpdateCharacter } = req.body;

    const validation = validateObject(char, "char");
    if (!validation.valid) return res.status(validation.status || 500).json(validation.error);

    try {
        await updateCharacter.all(char, parseInt(idNUM));
        return res.status(200).json({
            status: "success",
            message: "Character updated successfully",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating character:', error);
        return res.status(500).json({
            status: "error",
            code: "internal_error",
            message: "An error occurred while updating the character",
        });
    }
}

export async function updateArts(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const { idNUM } = req.params;
    const { arts }: { arts: Arts } = req.body;

    const validation = validateObject(arts, "arts");
    if (!validation.valid) return res.status(validation.status || 500).json(validation.error);

    try {
        await updateCharacter.arts(arts, parseInt(idNUM));
        return res.status(200).json({ message: 'Character arts updated successfully' });
    } catch (error) {
        console.error('Error updating arts:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred while updating character arts',
        });
    }
}

export async function updateZenkaiArts(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const { idNUM } = req.params;
    const { arts }: { arts: ZenkaiArts } = req.body;

    const validation = validateObject(arts, "arts");
    if (!validation.valid) return res.status(validation.status || 500).json(validation.error);

    if (!arts || typeof arts !== 'object') {
        return res.status(400).json({
            error: 'bad_request',
            message: 'The "zenkai arts" object is missing or invalid',
        });
    }

    try {
        await updateCharacter.zenkaiArts(arts, parseInt(idNUM));
        return res.status(200).json({ message: 'Character zenkai arts updated successfully' });
    } catch (error) {
        console.error('Error updating zenkai arts:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred while updating character zenkai arts',
        });
    }
}

export async function updateAbilities(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const { idNUM } = req.params;
    const { data }: { data: Abilities } = req.body;

    const validation = validateObject(data, "data");
    if (!validation.valid) return res.status(validation.status || 500).json(validation.error);

    try {
        await updateCharacter.abilities(data, parseInt(idNUM));
        return res.status(200).json({ message: 'Character abilities updated successfully' });
    } catch (error) {
        console.error('Error updating abilities:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred while updating character abilities',
        });
    }
}

export async function updateZenkaiAbilities(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const { idNUM } = req.params;
    const { data }: { data: ZenkaiAbilities } = req.body;

    const validation = validateObject(data, "data");
    if (!validation.valid) return res.status(validation.status || 500).json(validation.error);

    try {
        await updateCharacter.zenkaiAbilities(data, parseInt(idNUM));
        return res.status(200).json({ message: 'Character zenkai abilities updated successfully' });
    } catch (error) {
        console.error('Error updating zenkai abilities:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred while updating character zenkai abilities',
        });
    }
}

export async function updateBasic(req: Request<{ idNUM: string }>, res: Response): Promise<Response> {
    const { idNUM } = req.params;
    const { basic }: { basic: BasicUpdateData } = req.body;

    const validation = validateObject(basic, "basic");
    if (!validation.valid) return res.status(validation.status || 500).json(validation.error);
    try {
        await updateCharacter.basic(basic, parseInt(idNUM));
        return res.status(200).json({ message: 'Character basic data updated successfully' });
    } catch (error) {
        console.error('Error updating basic data:', error);
        return res.status(500).json({
            error: 'internal_error',
            message: 'An error occurred while updating character basic data',
        });
    }
}

export const characterGetController = {
    getById,
    getSummary,
    refreshSummary
}

export const characterUpdateController = {
    updateArts,
    updateAbilities,
    updateBasic,
    updateZenkaiAbilities,
    updateZenkaiArts,
    updateAll
}