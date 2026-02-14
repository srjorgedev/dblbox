# Community Ranking System (SQLite + Express + TypeScript)
**Implementation Instructions (repo → service → controller → route)**

This document explains how to implement a **professional, date-based, community ranking system** using:

- **SQLite**
- **Express + TypeScript**
- Your current project structure:
  - `repo`
  - `service`
  - `controller`
  - `route`

It includes:

- Full SQLite schema (with i18n)
- Indexes
- Vote logic (per-day storage)
- Rolling-window ranking logic
- Fairness rule: **latest vote per user/unit inside the window**
- Daily snapshot caching
- Fallback when there are no votes today

---

## 1) What this system solves

### You want a ranking where:
- Users vote: “Unit X is Top N”
- Ranking changes daily
- Some days have few votes or no votes
- Ranking still works and does not “break”
- Users are not forced to vote daily
- Daily voting does not give extra power

---

## 2) Core Concepts (IMPORTANT)

### 2.1 Ranking Group
A category of rankings.

Examples:
- `overall`
- `pvp`
- `tournament`
- `new_units`

Ranking groups are **language-neutral**.

Their UI text is stored separately with i18n.

---

### 2.2 Vote
A user says:

> “Unit DBL91-01S is Top 3”

Votes are stored **per day**.

---

### 2.3 Snapshot
A snapshot is the computed ranking for a specific day.

We store snapshots because:
- It makes API reads fast
- It allows fallback when there are no votes today
- It allows historical browsing (meta over time)

---

### 2.4 The fairness rule (the most important part)
When computing a rolling window (example: last 14 days):

- A user may vote multiple days in that window
- BUT for each `(user_id, unit_id, ranking_group_id)` we only count the **latest vote** inside the window

This prevents:
- daily voting advantage
- one user dominating by voting every day

---

---

## 3) SQLite: Schema (FINAL)

> Assumption: you already have a `lang` table like:
> - `en`
> - `es`
> - etc.

---

### 3.1 `ranking_group` (language-neutral)
```sql
CREATE TABLE ranking_group (
  _id TEXT PRIMARY KEY
);
```

---

### 3.2 `ranking_group_text` (i18n)
```sql
CREATE TABLE ranking_group_text (
  ranking_group_id TEXT NOT NULL,
  lang TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NULL,

  PRIMARY KEY (ranking_group_id, lang),
  FOREIGN KEY (ranking_group_id) REFERENCES ranking_group(_id),
  FOREIGN KEY (lang) REFERENCES lang(_code)
);
```

---

### 3.3 `ranking_vote` (per-day vote storage)
Votes are stored per day.

- A user can vote for the same unit again tomorrow
- Same day vote updates are allowed using UPSERT
- We store a daily bucket (`date`) and timestamps (`created_at`, `updated_at`)

```sql
CREATE TABLE ranking_vote (
  user_id TEXT NOT NULL,
  ranking_group_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,

  date TEXT NOT NULL, -- YYYY-MM-DD (UTC recommended)
  rank_position INTEGER NOT NULL CHECK(rank_position >= 1 AND rank_position <= 999),

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  PRIMARY KEY (user_id, ranking_group_id, unit_id, date),
  FOREIGN KEY (ranking_group_id) REFERENCES ranking_group(_id),
  FOREIGN KEY (unit_id) REFERENCES unit(_id)
);
```

---

### 3.4 `ranking_daily_snapshot` (snapshot header)
```sql
CREATE TABLE ranking_daily_snapshot (
  ranking_group_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD

  generated_at TEXT NOT NULL DEFAULT (datetime('now')),
  window_days INTEGER NOT NULL,

  PRIMARY KEY (ranking_group_id, date),
  FOREIGN KEY (ranking_group_id) REFERENCES ranking_group(_id)
);
```

---

### 3.5 `ranking_daily_snapshot_item` (snapshot items)
```sql
CREATE TABLE ranking_daily_snapshot_item (
  ranking_group_id TEXT NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD
  unit_id TEXT NOT NULL,

  score REAL NOT NULL,
  avg_rank REAL NOT NULL,
  votes_count INTEGER NOT NULL,

  position INTEGER NOT NULL, -- 1..N

  PRIMARY KEY (ranking_group_id, date, unit_id),
  FOREIGN KEY (ranking_group_id, date)
    REFERENCES ranking_daily_snapshot(ranking_group_id, date),
  FOREIGN KEY (unit_id) REFERENCES unit(_id)
);
```

---

---

## 4) SQLite: Indexes (REQUIRED)

These indexes are important for performance.

```sql
CREATE INDEX idx_ranking_vote_group_date
ON ranking_vote(ranking_group_id, date);

CREATE INDEX idx_ranking_vote_unit_date
ON ranking_vote(unit_id, date);

CREATE INDEX idx_ranking_vote_user_unit_date
ON ranking_vote(user_id, unit_id, date);
```

---

---

## 5) Why `date TEXT` instead of `DATE` or `DATETIME`?

SQLite does not have real `DATE` or `DATETIME` types.

It stores values as:
- TEXT
- INTEGER
- REAL
- BLOB
- NULL

Best practice:
- Store daily bucket as `YYYY-MM-DD` in a `TEXT` column.
- Store timestamps as `YYYY-MM-DD HH:MM:SS` in `TEXT`.

This works perfectly with:
- sorting
- filtering
- `date()` / `datetime()` functions

---

---

## 6) SQL: Vote submission (UPSERT)

This allows:
- one vote per day per unit per group
- user can edit their vote for the same day

```sql
INSERT INTO ranking_vote (
  user_id, ranking_group_id, unit_id,
  date, rank_position,
  created_at, updated_at
)
VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
ON CONFLICT(user_id, ranking_group_id, unit_id, date)
DO UPDATE SET
  rank_position = excluded.rank_position,
  updated_at = datetime('now');
```

---

---

## 7) SQL: Rolling window ranking (latest vote per user/unit)

This is the core ranking query.

### Inputs
- `ranking_group_id`
- `date` (the day you want the ranking for)
- `windowDays` (example: 14)

### Output
- `unit_id`
- `avg_rank`
- `votes_count`

```sql
WITH window_votes AS (
  SELECT *
  FROM ranking_vote
  WHERE ranking_group_id = ?
    AND date >= date(?, '-' || (? - 1) || ' days')
    AND date <= date(?)
),
latest_per_user_unit AS (
  SELECT
    user_id,
    ranking_group_id,
    unit_id,
    MAX(date) AS latest_date
  FROM window_votes
  GROUP BY user_id, ranking_group_id, unit_id
),
effective_votes AS (
  SELECT v.*
  FROM window_votes v
  JOIN latest_per_user_unit l
    ON l.user_id = v.user_id
   AND l.ranking_group_id = v.ranking_group_id
   AND l.unit_id = v.unit_id
   AND l.latest_date = v.date
)
SELECT
  unit_id,
  AVG(rank_position) AS avg_rank,
  COUNT(*) AS votes_count
FROM effective_votes
GROUP BY unit_id
ORDER BY avg_rank ASC, votes_count DESC;
```

---

---

## 8) Snapshot Strategy + Fallback

### 8.1 Why snapshots?
If you compute the ranking live on every request:
- queries get heavy
- API gets slower

So we:
- compute ranking once per day
- store results
- read from snapshot quickly

---

### 8.2 Snapshot generation rules
When generating snapshot for day `D`:

1. Delete snapshot for D if it exists (regeneration)
2. Insert snapshot header
3. Compute ranking using the rolling window
4. Insert items with `position = 1..N`

---

### 8.3 Fallback when there are no votes today
If day D has no votes:
- snapshot items might be empty

When fetching ranking for D:
1. try snapshot for D
2. if empty → find latest snapshot date <= D that has items
3. return that

---

---

## 9) Express + TypeScript: Project structure

Your structure must be:

- **repo**: SQL only
- **service**: business rules, transactions, fallback logic
- **controller**: HTTP parsing + validation
- **route**: Express router

---

## 10) Recommended file layout

```
src/
  db/
    sqlite.ts

  ranking/
    ranking.repo.ts
    ranking.service.ts
    ranking.controller.ts
    ranking.route.ts

  app.ts
```

---

---

## 11) DB setup (better-sqlite3)

`src/db/sqlite.ts`
```ts
import Database from "better-sqlite3";

export const db = new Database("db.sqlite");

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
```

---

---

## 12) Ranking Repo (SQL layer)

`src/ranking/ranking.repo.ts`

### Repo responsibilities
- Only SQL
- No HTTP
- No business decisions

---

### 12.1 Get groups (i18n)
```ts
import { db } from "../db/sqlite";

export function getGroups(lang: string) {
  const stmt = db.prepare(`
    SELECT
      rg._id,
      rgt.title,
      rgt.description
    FROM ranking_group rg
    JOIN ranking_group_text rgt
      ON rgt.ranking_group_id = rg._id
    WHERE rgt.lang = ?
    ORDER BY rg._id;
  `);

  return stmt.all(lang) as Array<{
    _id: string;
    title: string;
    description: string | null;
  }>;
}
```

---

### 12.2 Upsert vote (per day)
```ts
export function upsertVote(params: {
  userId: string;
  rankingGroupId: string;
  unitId: string;
  date: string; // YYYY-MM-DD
  rankPosition: number;
}) {
  const stmt = db.prepare(`
    INSERT INTO ranking_vote (
      user_id, ranking_group_id, unit_id,
      date, rank_position,
      created_at, updated_at
    )
    VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    ON CONFLICT(user_id, ranking_group_id, unit_id, date)
    DO UPDATE SET
      rank_position = excluded.rank_position,
      updated_at = datetime('now');
  `);

  stmt.run(
    params.userId,
    params.rankingGroupId,
    params.unitId,
    params.date,
    params.rankPosition
  );
}
```

---

### 12.3 Compute ranking rows (rolling window)
```ts
export function computeRankingRows(params: {
  rankingGroupId: string;
  date: string;
  windowDays: number;
}) {
  const stmt = db.prepare(`
    WITH window_votes AS (
      SELECT *
      FROM ranking_vote
      WHERE ranking_group_id = ?
        AND date >= date(?, '-' || (? - 1) || ' days')
        AND date <= date(?)
    ),
    latest_per_user_unit AS (
      SELECT
        user_id,
        ranking_group_id,
        unit_id,
        MAX(date) AS latest_date
      FROM window_votes
      GROUP BY user_id, ranking_group_id, unit_id
    ),
    effective_votes AS (
      SELECT v.*
      FROM window_votes v
      JOIN latest_per_user_unit l
        ON l.user_id = v.user_id
       AND l.ranking_group_id = v.ranking_group_id
       AND l.unit_id = v.unit_id
       AND l.latest_date = v.date
    )
    SELECT
      unit_id,
      AVG(rank_position) AS avg_rank,
      COUNT(*) AS votes_count
    FROM effective_votes
    GROUP BY unit_id
    ORDER BY avg_rank ASC, votes_count DESC;
  `);

  return stmt.all(
    params.rankingGroupId,
    params.date,
    params.windowDays,
    params.date
  ) as Array<{ unit_id: string; avg_rank: number; votes_count: number }>;
}
```

---

### 12.4 Delete snapshot (header + items)
```ts
export function deleteSnapshot(params: { rankingGroupId: string; date: string }) {
  db.prepare(`
    DELETE FROM ranking_daily_snapshot_item
    WHERE ranking_group_id = ? AND date = ?;
  `).run(params.rankingGroupId, params.date);

  db.prepare(`
    DELETE FROM ranking_daily_snapshot
    WHERE ranking_group_id = ? AND date = ?;
  `).run(params.rankingGroupId, params.date);
}
```

---

### 12.5 Insert snapshot header
```ts
export function insertSnapshotHeader(params: {
  rankingGroupId: string;
  date: string;
  windowDays: number;
}) {
  db.prepare(`
    INSERT INTO ranking_daily_snapshot (ranking_group_id, date, window_days)
    VALUES (?, ?, ?);
  `).run(params.rankingGroupId, params.date, params.windowDays);
}
```

---

### 12.6 Insert snapshot item
```ts
export function insertSnapshotItem(params: {
  rankingGroupId: string;
  date: string;
  unitId: string;
  position: number;
  avgRank: number;
  votesCount: number;
  score: number;
}) {
  db.prepare(`
    INSERT INTO ranking_daily_snapshot_item (
      ranking_group_id, date, unit_id,
      score, avg_rank, votes_count,
      position
    )
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `).run(
    params.rankingGroupId,
    params.date,
    params.unitId,
    params.score,
    params.avgRank,
    params.votesCount,
    params.position
  );
}
```

---

### 12.7 Find best snapshot date (fallback)
```ts
export function getBestSnapshotDate(params: {
  rankingGroupId: string;
  date: string;
}) {
  return db.prepare(`
    SELECT s.date
    FROM ranking_daily_snapshot s
    WHERE s.ranking_group_id = ?
      AND s.date <= ?
      AND EXISTS (
        SELECT 1
        FROM ranking_daily_snapshot_item i
        WHERE i.ranking_group_id = s.ranking_group_id
          AND i.date = s.date
      )
    ORDER BY s.date DESC
    LIMIT 1;
  `).get(params.rankingGroupId, params.date) as { date: string } | undefined;
}
```

---

### 12.8 Get snapshot items
```ts
export function getSnapshotItems(params: {
  rankingGroupId: string;
  date: string;
}) {
  return db.prepare(`
    SELECT
      position,
      unit_id,
      score,
      avg_rank,
      votes_count
    FROM ranking_daily_snapshot_item
    WHERE ranking_group_id = ? AND date = ?
    ORDER BY position ASC;
  `).all(params.rankingGroupId, params.date) as Array<{
    position: number;
    unit_id: string;
    score: number;
    avg_rank: number;
    votes_count: number;
  }>;
}
```

---

---

## 13) Ranking Service (business rules)

`src/ranking/ranking.service.ts`

### Service responsibilities
- validation rules (business)
- transactions
- snapshot generation
- fallback behavior

---

### 13.1 Submit vote
```ts
import * as repo from "./ranking.repo";

export function submitVote(params: {
  userId: string;
  rankingGroupId: string;
  unitId: string;
  date: string;
  rankPosition: number;
}) {
  repo.upsertVote(params);
}
```

---

### 13.2 Generate snapshot
```ts
import { db } from "../db/sqlite";
import * as repo from "./ranking.repo";

export function generateSnapshot(params: {
  rankingGroupId: string;
  date: string;
  windowDays: number;
}) {
  const tx = db.transaction(() => {
    repo.deleteSnapshot({ rankingGroupId: params.rankingGroupId, date: params.date });

    repo.insertSnapshotHeader({
      rankingGroupId: params.rankingGroupId,
      date: params.date,
      windowDays: params.windowDays
    });

    const rows = repo.computeRankingRows(params);

    rows.forEach((r, index) => {
      const position = index + 1;

      repo.insertSnapshotItem({
        rankingGroupId: params.rankingGroupId,
        date: params.date,
        unitId: r.unit_id,
        position,
        avgRank: r.avg_rank,
        votesCount: r.votes_count,
        score: r.avg_rank
      });
    });
  });

  tx();
}
```

---

### 13.3 Get ranking for date (with fallback)
```ts
import * as repo from "./ranking.repo";

export function getRankingForDate(params: {
  rankingGroupId: string;
  date: string;
}) {
  const best = repo.getBestSnapshotDate(params);

  if (!best) {
    return {
      usedSnapshotDate: null,
      items: []
    };
  }

  return {
    usedSnapshotDate: best.date,
    items: repo.getSnapshotItems({
      rankingGroupId: params.rankingGroupId,
      date: best.date
    })
  };
}
```

---

---

## 14) Ranking Controller (HTTP layer)

`src/ranking/ranking.controller.ts`

---

### 14.1 Get groups
```ts
import { Request, Response } from "express";
import * as repo from "./ranking.repo";

export function getGroups(req: Request, res: Response) {
  const lang = String(req.query.lang || "en");
  return res.json(repo.getGroups(lang));
}
```

---

### 14.2 Submit vote
```ts
import { Request, Response } from "express";
import * as service from "./ranking.service";

export function submitVote(req: Request, res: Response) {
  const { userId, rankingGroupId, unitId, rankPosition, date } = req.body;

  if (!userId || !rankingGroupId || !unitId || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const rank = Number(rankPosition);
  if (!Number.isInteger(rank) || rank < 1 || rank > 999) {
    return res.status(400).json({ error: "Invalid rankPosition" });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date format (YYYY-MM-DD)" });
  }

  service.submitVote({
    userId,
    rankingGroupId,
    unitId,
    date,
    rankPosition: rank
  });

  return res.json({ ok: true });
}
```

---

### 14.3 Generate snapshot
```ts
import { Request, Response } from "express";
import * as service from "./ranking.service";

export function generateSnapshot(req: Request, res: Response) {
  const rankingGroupId = String(req.body.rankingGroupId);
  const date = String(req.body.date);
  const windowDays = Number(req.body.windowDays || 14);

  if (!rankingGroupId || !date) {
    return res.status(400).json({ error: "Missing rankingGroupId or date" });
  }

  if (!Number.isInteger(windowDays) || windowDays < 1 || windowDays > 90) {
    return res.status(400).json({ error: "Invalid windowDays" });
  }

  service.generateSnapshot({ rankingGroupId, date, windowDays });
  return res.json({ ok: true });
}
```

---

### 14.4 Get ranking
```ts
import { Request, Response } from "express";
import * as service from "./ranking.service";

export function getRanking(req: Request, res: Response) {
  const rankingGroupId = String(req.params.groupId);
  const date = String(req.query.date || new Date().toISOString().slice(0, 10));

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "Invalid date format (YYYY-MM-DD)" });
  }

  const result = service.getRankingForDate({ rankingGroupId, date });

  return res.json({
    rankingGroupId,
    date,
    usedSnapshotDate: result.usedSnapshotDate,
    items: result.items
  });
}
```

---

---

## 15) Ranking Routes

`src/ranking/ranking.route.ts`

```ts
import { Router } from "express";
import * as controller from "./ranking.controller";

export const rankingRouter = Router();

rankingRouter.get("/groups", controller.getGroups);
rankingRouter.post("/vote", controller.submitVote);

rankingRouter.post("/snapshot/generate", controller.generateSnapshot);
rankingRouter.get("/:groupId", controller.getRanking);
```

---

---

## 16) Plug routes into your app

`src/app.ts`
```ts
import express from "express";
import { rankingRouter } from "./ranking/ranking.route";

const app = express();
app.use(express.json());

app.use("/ranking", rankingRouter);

app.listen(3000, () => console.log("API running on :3000"));
```

---

---

## 17) How the client should use it

### 17.1 User votes
`POST /ranking/vote`

Body:
```json
{
  "userId": "u1",
  "rankingGroupId": "overall",
  "unitId": "DBL91-01S",
  "rankPosition": 3,
  "date": "2026-02-13"
}
```

---

### 17.2 Generate snapshot daily
`POST /ranking/snapshot/generate`

Body:
```json
{
  "rankingGroupId": "overall",
  "date": "2026-02-13",
  "windowDays": 14
}
```

This should be run:
- by a cron job
- or by an admin panel action

---

### 17.3 Fetch ranking for a day
`GET /ranking/overall?date=2026-02-13`

If there are no votes today:
- the API automatically falls back to the latest available snapshot date.

---

---

## 18) Important: Do NOT store `is_top` in `unit`

`is_top` does not belong to `unit` because ranking is:

- date-based
- group-based
- community-based

Instead:
- Top 1 is `position = 1`
- Top 10 is `position <= 10`

---

---

## 19) Optional improvements (after base system works)

After the base system is working, you can upgrade:

- Bayesian score (solves low vote count)
- time decay weights
- trending score (difference vs yesterday)
- per-user cooldown (anti-spam)
- per-user vote limit per group per day

---

---

## 20) Final Notes

This implementation provides:

- Stable daily rankings
- Works with low daily votes
- Works even with 0 votes days
- No daily-vote advantage
- Full vote history
- Fast API reads with snapshots
- Clean Express TS architecture (repo/service/controller/route)

