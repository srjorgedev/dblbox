import { Request, Response } from 'express';
import { getCharacter } from "../services/character.get.services";
import type { FormatedCharacter } from "../types/formated.character";
import { basicFormat, summaryFormat } from "../utils/character.format";
import { getData } from "../utils/invoque.data";

let cachedCharacters: unknown;
let lastFetchTime: number;
const CACHE_EXPIRATION_TIME: number = 60 * 60 * 1000;

let cachedCharacter: FormatedCharacter;
let lastFetchTime2: number;
const CACHE_EXPIRATION_TIME2: number = 60 * 60 * 1000;

export async function getSummary(_: Request, res: Response) {
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

export async function getById(req: Request<{ idNUM: string }>, res: Response) {
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

export const characterController = {
    getById,
    getSummary,
}