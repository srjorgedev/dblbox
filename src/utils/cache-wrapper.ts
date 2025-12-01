import { cache as localCache } from "../domain/service/cache.sevice";
import { log } from "./log";

/**
 * Envuelve una promesa con lógica de caché.
 * @param key Clave única para el caché
 * @param fetchFunction La función que trae los datos reales (DB o API)
 * @param ttl Tiempo de vida en segundos
 */
export async function getOrSetCache<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number = 600
): Promise<T> {
    const cachedData = localCache.get<T>(key);
    
    if (cachedData) {
        log(`[CACHE WRAPPER]: Existe cache para -> ${key}`);
        return cachedData;
    }

    log(`[CACHE WRAPPER]: No existe cache para -> ${key}`);
    const data = await fetchFunction();

    if (data) {
        localCache.set(key, data, ttl);
    }

    return data;
}