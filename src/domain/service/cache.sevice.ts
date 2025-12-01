import NodeCache from "node-cache"

class LocalCache {
    private cache: NodeCache;
    private static instance: LocalCache;

    constructor() {
        this.cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
    }

    public static getInstance(): LocalCache {
        if (!LocalCache.instance) {
            LocalCache.instance = new LocalCache();
        }
        return LocalCache.instance;
    }

    public get<T>(key: string): T | undefined {
        return this.cache.get<T>(key);
    }

    public set(key: string, value: any, ttl?: number): boolean {
        return this.cache.set(key, value, ttl || 600);
    }

    public del(key: string): number {
        return this.cache.del(key);
    }
    
    public flush(): void {
        this.cache.flushAll();
    }
}

export const cache = LocalCache.getInstance();

