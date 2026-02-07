import e from "express";
import path from 'path';
import Database from "@/db/connection";
import { globalErrorHandler } from "@/http/middlewares/error.middleware";
import { initDblBoxModule } from "@/dblbox.init";
import cors from "cors"

async function app() {
    const PORT = process.env.PORT || 1110;
    const db_url: string = `file:${path.join(process.cwd(), 'data', 'db', 'dblbox.db')}`;

    const conn = new Database(db_url).getConnection();

    const server = e();
    server.use(e.json());
    server.use(cors());

    const dblBoxRouter = initDblBoxModule(conn);
    server.use("/api/v1/assets", e.static(path.join(process.cwd(), 'data', 'assets')));
    server.use("/api/v1", dblBoxRouter);

    server.use(globalErrorHandler);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

app();