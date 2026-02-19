declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string; 
            DATABASE: string; 
            NODE_ENV: 'development' | 'production';
        }
    }
}

// Necesario para que TypeScript lo trate como un módulo
export { };
