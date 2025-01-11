import e, { Router } from "express";
import { getCharacter } from "../services/character.services.js";
import { basicFormat } from "../utils/character.format.js";

const ROUTER = e.Router();

let cachedCharacters = null;
let lastFetchTime = null;
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

ROUTER.get("/all", async (req, res) => {
    const currentTime = Date.now();

    if (cachedCharacters && (currentTime - lastFetchTime) < CACHE_EXPIRATION_TIME) {
        console.log("Usando datos de caché");
        return res.json(cachedCharacters);
    }

    const characters = await getCharacter.all();

    const formatedCharacters = await Promise.all(
        characters.map(character => basicFormat(character))
    );

    cachedCharacters = formatedCharacters;
    lastFetchTime = currentTime;

    return res.json(formatedCharacters);
});

ROUTER.get("/:idNUM", async (req, res) => {
    const { idNUM } = req.params;
    let formatedCharacters;

    try {
        const characters = await getCharacter.byNumID(idNUM);
        formatedCharacters = await basicFormat(characters[0]);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }

    res.json(formatedCharacters);
});

export default ROUTER