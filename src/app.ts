import cors from "cors";
import "dotenv/config";
import e from "express";
import path from "node:path";
import Database from "./config/db";
import { initModules } from "./init";
import { globalErrorHandler } from "./middlewares/error.handler";

async function main() {
    const PORT = process.env.PORT || 1130;
    const DB = process.env.DATABASE;
    const DB_URL = `file:${path.join(process.cwd(), DB)}`;

    const db = new Database(DB_URL).getConnection();

    const server = e();

    server.set("trust proxy", 1);

    server.use(e.json());
    server.use(e.urlencoded({ extended: true }));
    server.use(cors({
        origin: ["http://localhost:4321"],
        allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
    }));

    const dblBoxRouter = initModules(db);
    server.use("/api/v1/assets", e.static(path.join(process.cwd(), 'data', 'assets')));
    server.use("/api/v1", dblBoxRouter);

    server.use(globalErrorHandler);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main();