import path from 'path';
import { createClient } from "@libsql/client";
import { RankingRepo } from "./src/domain/repository/ranking.repo";

async function test() {
    const db_url = `file:${path.join(process.cwd(), 'data', 'db', 'dblbox.db')}`;
    const client = createClient({ url: db_url });
    const repo = new RankingRepo(client);

    try {
        console.log("Testing upsertVote...");
        await repo.upsertVote({
            userId: "user1",
            rankingGroupId: "overall",
            unitId: "DBL-EVT-00S",
            date: "2026-02-13",
            rankPosition: 1
        });
        console.log("upsertVote success!");

        console.log("Testing getGroups...");
        const groups = await repo.getGroups("en");
        console.log("Groups:", JSON.stringify(groups));

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
