import cors from "cors";
import "dotenv/config";
import e from "express";
import path from "node:path";
import Database from "./config/db";
import { initModules } from "./init";
import { globalErrorHandler } from "./middlewares/error.handler";

import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";

async function main() {
    const PORT = process.env.PORT || 1130;
    const DB = process.env.DATABASE;
    const CDB = process.env.COMMUNITY_DB;

    const DB_URL = `file:${path.join(process.cwd(), DB)}`;
    const C_DB_URL = `file:${path.join(process.cwd(), CDB)}`;

    const dblDB = new Database(DB_URL).getConnection();
    const cDB = new Database(C_DB_URL).getConnection();

    const server = e();

    server.set("trust proxy", 1);

    server.use(e.json());
    server.use(e.urlencoded({ extended: true }));
    server.use(cookieParser());
    server.use(session({
        secret: process.env.SESSION_SECRET || "keyboard cat", 
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        }
    }));
    server.use(passport.initialize())

    server.use(cors({
        origin: ["http://localhost:4321"],
        allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
        credentials: true
    }));

    const dblBoxRouter = initModules(dblDB, cDB);
    server.use("/api/v1/assets", e.static(path.join(process.cwd(), 'data', 'assets')));
    server.use("/api/v1", dblBoxRouter);

    server.use(globalErrorHandler);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

main();