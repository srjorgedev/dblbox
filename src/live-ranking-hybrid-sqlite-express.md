# Live Ranking + Snapshots (Hybrid System)
## SQLite + Express TypeScript
### Project Structure: repo → service → controller → route

This document adds a **LIVE ranking mode** to the existing system so users can:

- Vote and instantly see results (no waiting for snapshots)
- Fetch a live Top N ranking for a group/date
- Fetch the live rank of a specific unit
- Still keep snapshots for fast reads + historical ranking

> IMPORTANT: We do **NOT** compute ranking in Node.js by loading all votes into memory.  
> We compute ranking **in SQL** (SQLite), and Node only orchestrates queries.

---

# 0) Why Live Ranking Exists

Snapshots are great for:
- fast reads
- stable ranking
- daily history
- low CPU usage

But snapshots are bad for:
- immediate feedback after voting
- real-time ranking

So the correct approach is:

✅ **LIVE ranking** = computed from votes (rolling window + latest per user)  
✅ **SNAPSHOT ranking** = cached result for fast reads and history

---

# 1) New API Endpoints (Live)

## 1.1 Get live Top ranking for a group

```
GET /ranking/:groupId/live
```

Query params:
- `date` (optional) → `YYYY-MM-DD` (default = today UTC)
- `windowDays` (optional) → integer (default recommended: `14`)
- `limit` (optional) → integer (default recommended: `100`)

Response:
```json
{
  "rankingGroupId": "overall",
  "date": "2026-02-13",
  "windowDays": 14,
  "items": [
    {
      "position": 1,
      "unitId": "DBL01-06H",
      "avgRank": 1.73,
      "votesCount": 71
    }
  ]
}
```

---

## 1.2 Get live rank of a specific unit

```
GET /ranking/:groupId/live/unit/:unitId
```

Query params:
- `date` (optional) → `YYYY-MM-DD`
- `windowDays` (optional) → integer (default `14`)

Response (ranked):
```json
{
  "rankingGroupId": "overall",
  "unitId": "DBL01-06H",
  "date": "2026-02-13",
  "windowDays": 14,
  "position": 8,
  "avgRank": 2.91,
  "votesCount": 144
}
```

Response (not ranked):
```json
{
  "rankingGroupId": "overall",
  "unitId": "DBL01-06H",
  "date": "2026-02-13",
  "windowDays": 14,
  "position": null
}
```

---

## 1.3 Vote and return immediate feedback (recommended UX)

```
POST /ranking/:groupId/vote-live
```

Body:
```json
{
  "userId": "user_x",
  "unitId": "DBL01-06H",
  "rankPosition": 3,
  "date": "2026-02-13"
}
```

Response:
```json
{
  "ok": true,
  "voteSaved": true,
  "yourLastVote": {
    "unitId": "DBL01-06H",
    "date": "2026-02-13",
    "rankPosition": 3
  },
  "liveUnitRank": {
    "position": 8,
    "avgRank": 2.91,
    "votesCount": 144
  }
}
```

---

# 2) Database: No Schema Changes Required

This system reuses the existing tables:

- `ranking_vote`
- `ranking_daily_snapshot`
- `ranking_daily_snapshot_item`

You do NOT need to modify schema.

---

# 3) Performance Indexes (Required)

Live ranking queries can be expensive if you have many votes.

Add these indexes:

```sql
CREATE INDEX IF NOT EXISTS idx_ranking_vote_group_date
ON ranking_vote(ranking_group_id, date);

CREATE INDEX IF NOT EXISTS idx_ranking_vote_group_unit_date
ON ranking_vote(ranking_group_id, unit_id, date);

CREATE INDEX IF NOT EXISTS idx_ranking_vote_group_user_unit_date
ON ranking_vote(ranking_group_id, user_id, unit_id, date);
```

---

# 4) Core SQL Logic (Live)

Live ranking uses the same fairness rule:

### Rule
Inside the rolling window:
- a user can vote multiple times
- but only their **latest vote per (user, group, unit)** counts

---

## 4.1 Live Top N query (Repo)

This returns ranking rows for the live Top N.

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
),
ranked AS (
  SELECT
    unit_id,
    AVG(rank_position) AS avg_rank,
    COUNT(*) AS votes_count
  FROM effective_votes
  GROUP BY unit_id
)
SELECT
  unit_id,
  avg_rank,
  votes_count
FROM ranked
ORDER BY avg_rank ASC, votes_count DESC
LIMIT ?;
```

---

## 4.2 Live rank of a specific unit (Repo)

This computes the ranking for ALL units, then extracts one unit rank.

### Why?
Because rank depends on relative ordering.

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
),
ranked AS (
  SELECT
    unit_id,
    AVG(rank_position) AS avg_rank,
    COUNT(*) AS votes_count
  FROM effective_votes
  GROUP BY unit_id
),
ranked_with_positions AS (
  SELECT
    unit_id,
    avg_rank,
    votes_count,
    ROW_NUMBER() OVER (ORDER BY avg_rank ASC, votes_count DESC) AS position
  FROM ranked
)
SELECT
  unit_id,
  avg_rank,
  votes_count,
  position
FROM ranked_with_positions
WHERE unit_id = ?
LIMIT 1;
```

> This requires SQLite 3.25+ for `ROW_NUMBER()` (almost always available).

---

# 5) Repo Layer

## 5.1 File
Extend:
```
src/ranking/ranking.repo.ts
```

---

## 5.2 Repo functions to implement

### 5.2.1 `getLiveTopRankingRows()`

```ts
import { db } from "../db/sqlite";

export function getLiveTopRankingRows(params: {
  rankingGroupId: string;
  date: string;
  windowDays: number;
  limit: number;
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
    ),
    ranked AS (
      SELECT
        unit_id,
        AVG(rank_position) AS avg_rank,
        COUNT(*) AS votes_count
      FROM effective_votes
      GROUP BY unit_id
    )
    SELECT
      unit_id,
      avg_rank,
      votes_count
    FROM ranked
    ORDER BY avg_rank ASC, votes_count DESC
    LIMIT ?;
  `);

  return stmt.all(
    params.rankingGroupId,
    params.date,
    params.windowDays,
    params.date,
    params.limit
  ) as Array<{ unit_id: string; avg_rank: number; votes_count: number }>;
}
```

---

### 5.2.2 `getLiveUnitRankRow()`

```ts
export function getLiveUnitRankRow(params: {
  rankingGroupId: string;
  date: string;
  windowDays: number;
  unitId: string;
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
    ),
    ranked AS (
      SELECT
        unit_id,
        AVG(rank_position) AS avg_rank,
        COUNT(*) AS votes_count
      FROM effective_votes
      GROUP BY unit_id
    ),
    ranked_with_positions AS (
      SELECT
        unit_id,
        avg_rank,
        votes_count,
        ROW_NUMBER() OVER (ORDER BY avg_rank ASC, votes_count DESC) AS position
      FROM ranked
    )
    SELECT
      unit_id,
      avg_rank,
      votes_count,
      position
    FROM ranked_with_positions
    WHERE unit_id = ?
    LIMIT 1;
  `);

  const row = stmt.get(
    params.rankingGroupId,
    params.date,
    params.windowDays,
    params.date,
    params.unitId
  ) as
    | { unit_id: string; avg_rank: number; votes_count: number; position: number }
    | undefined;

  return row ?? null;
}
```

---

# 6) Service Layer

## 6.1 File
Extend:
```
src/ranking/ranking.service.ts
```

---

## 6.2 Helper: today UTC date

```ts
export function getTodayUTCDateString() {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(now.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
```

---

## 6.3 `getLiveTopRanking()`

```ts
import * as repo from "./ranking.repo";

export function getLiveTopRanking(params: {
  rankingGroupId: string;
  date?: string;
  windowDays?: number;
  limit?: number;
}) {
  const date = params.date ?? getTodayUTCDateString();
  const windowDays = params.windowDays ?? 14;
  const limit = params.limit ?? 100;

  const rows = repo.getLiveTopRankingRows({
    rankingGroupId: params.rankingGroupId,
    date,
    windowDays,
    limit
  });

  return {
    rankingGroupId: params.rankingGroupId,
    date,
    windowDays,
    items: rows.map((r, idx) => ({
      position: idx + 1,
      unitId: r.unit_id,
      avgRank: r.avg_rank,
      votesCount: r.votes_count
    }))
  };
}
```

---

## 6.4 `getLiveUnitRank()`

```ts
export function getLiveUnitRank(params: {
  rankingGroupId: string;
  unitId: string;
  date?: string;
  windowDays?: number;
}) {
  const date = params.date ?? getTodayUTCDateString();
  const windowDays = params.windowDays ?? 14;

  const row = repo.getLiveUnitRankRow({
    rankingGroupId: params.rankingGroupId,
    date,
    windowDays,
    unitId: params.unitId
  });

  if (!row) {
    return {
      rankingGroupId: params.rankingGroupId,
      unitId: params.unitId,
      date,
      windowDays,
      position: null
    };
  }

  return {
    rankingGroupId: params.rankingGroupId,
    unitId: row.unit_id,
    date,
    windowDays,
    position: row.position,
    avgRank: row.avg_rank,
    votesCount: row.votes_count
  };
}
```

---

## 6.5 Vote + immediate feedback (optional but recommended)

This reuses your existing `upsertVote()` from the snapshot system.

```ts
export function voteLiveAndReturnFeedback(params: {
  rankingGroupId: string;
  userId: string;
  unitId: string;
  rankPosition: number;
  date?: string;
  windowDays?: number;
}) {
  const date = params.date ?? getTodayUTCDateString();
  const windowDays = params.windowDays ?? 14;

  // Save vote (existing repo function)
  repo.upsertVote({
    userId: params.userId,
    rankingGroupId: params.rankingGroupId,
    unitId: params.unitId,
    date,
    rankPosition: params.rankPosition
  });

  // Return immediate rank feedback
  const liveRank = getLiveUnitRank({
    rankingGroupId: params.rankingGroupId,
    unitId: params.unitId,
    date,
    windowDays
  });

  return {
    ok: true,
    voteSaved: true,
    yourLastVote: {
      unitId: params.unitId,
      date,
      rankPosition: params.rankPosition
    },
    liveUnitRank: {
      position: liveRank.position,
      avgRank: liveRank.avgRank ?? null,
      votesCount: liveRank.votesCount ?? null
    }
  };
}
```

---

# 7) Controller Layer

## 7.1 File
Extend:
```
src/ranking/ranking.controller.ts
```

---

## 7.2 Validation helpers

```ts
export function isValidDateYYYYMMDD(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
```

---

## 7.3 Controller: live Top ranking

```ts
import { Request, Response } from "express";
import * as service from "./ranking.service";
import { isValidDateYYYYMMDD } from "./ranking.validation";

export function getLiveRanking(req: Request, res: Response) {
  const { groupId } = req.params;

  const date = req.query.date as string | undefined;
  const windowDays = req.query.windowDays ? Number(req.query.windowDays) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  if (date && !isValidDateYYYYMMDD(date)) {
    return res.status(400).json({ error: "Invalid date (YYYY-MM-DD)" });
  }

  if (windowDays !== undefined && (!Number.isInteger(windowDays) || windowDays < 1 || windowDays > 90)) {
    return res.status(400).json({ error: "Invalid windowDays" });
  }

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1 || limit > 500)) {
    return res.status(400).json({ error: "Invalid limit" });
  }

  const data = service.getLiveTopRanking({
    rankingGroupId: groupId,
    date,
    windowDays,
    limit
  });

  return res.json(data);
}
```

---

## 7.4 Controller: live unit rank

```ts
export function getLiveUnitRank(req: Request, res: Response) {
  const { groupId, unitId } = req.params;

  const date = req.query.date as string | undefined;
  const windowDays = req.query.windowDays ? Number(req.query.windowDays) : undefined;

  if (date && !isValidDateYYYYMMDD(date)) {
    return res.status(400).json({ error: "Invalid date (YYYY-MM-DD)" });
  }

  if (windowDays !== undefined && (!Number.isInteger(windowDays) || windowDays < 1 || windowDays > 90)) {
    return res.status(400).json({ error: "Invalid windowDays" });
  }

  const data = service.getLiveUnitRank({
    rankingGroupId: groupId,
    unitId,
    date,
    windowDays
  });

  return res.json(data);
}
```

---

## 7.5 Controller: vote live

```ts
export function voteLive(req: Request, res: Response) {
  const { groupId } = req.params;
  const { userId, unitId, rankPosition, date, windowDays } = req.body;

  if (!userId || !unitId) {
    return res.status(400).json({ error: "Missing userId or unitId" });
  }

  const rank = Number(rankPosition);
  if (!Number.isInteger(rank) || rank < 1 || rank > 999) {
    return res.status(400).json({ error: "Invalid rankPosition" });
  }

  if (date && date !== null && !isValidDateYYYYMMDD(date)) {
    return res.status(400).json({ error: "Invalid date (YYYY-MM-DD)" });
  }

  const wd = windowDays ? Number(windowDays) : undefined;
  if (wd !== undefined && (!Number.isInteger(wd) || wd < 1 || wd > 90)) {
    return res.status(400).json({ error: "Invalid windowDays" });
  }

  const data = service.voteLiveAndReturnFeedback({
    rankingGroupId: groupId,
    userId,
    unitId,
    rankPosition: rank,
    date,
    windowDays: wd
  });

  return res.json(data);
}
```

---

# 8) Routes Layer

## 8.1 File
Extend:
```
src/ranking/ranking.routes.ts
```

---

## 8.2 Add routes

```ts
import { Router } from "express";
import * as controller from "./ranking.controller";

export const rankingRouter = Router();

// NEW: live ranking endpoints
rankingRouter.get("/:groupId/live", controller.getLiveRanking);
rankingRouter.get("/:groupId/live/unit/:unitId", controller.getLiveUnitRank);
rankingRouter.post("/:groupId/vote-live", controller.voteLive);
```

---

# 9) Important Notes

## 9.1 Live ranking is heavier than snapshots
Live ranking executes:
- window filtering
- latest vote grouping
- aggregation
- sorting

So you should:
- limit `windowDays` (14 or 30 max)
- limit `limit` (100 recommended)
- keep indexes

---

## 9.2 When to use snapshots vs live

### Use snapshots for:
- homepage Top 100
- stable daily ranking
- history browsing
- mobile fast load

### Use live for:
- after voting (instant feedback)
- "current meta right now"
- admin debugging
- power users

---

## 9.3 Do NOT compute in Node memory
Never do:
- `SELECT * FROM ranking_vote`
- then compute ranking in JS

That will not scale and will waste RAM.

---

# 10) Final Checklist

- [ ] Add indexes
- [ ] Implement repo functions
- [ ] Implement service functions
- [ ] Implement controllers
- [ ] Add routes
- [ ] Test endpoints
- [ ] Confirm live ranking matches snapshot ranking for same date (after snapshot generation)

---
