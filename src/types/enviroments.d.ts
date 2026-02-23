declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string;
            DATABASE: string;
            COMMUNITY_DB: string;
            JWT_SECRET: string;
            HASH_SALT: number;
            NODE_ENV: 'development' | 'production';
            GOOGLE_CLIENT_SECRET: string;
            GOOGLE_CLIENT_ID: string;
            GOOGLE_CALLBACK_URL: string;
        }
    }
}

export { };
