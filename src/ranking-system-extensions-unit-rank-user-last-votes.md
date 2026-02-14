# Ranking System Extensions (SQLite + Express TS)
## Add: Unit Current Rank + User Last Votes
### Project Structure: repo → service → controller → route

This document extends the existing ranking system with **3 new capabilities**:

1) **Get the current rank of a specific unit** (for a ranking group + date)  
2) **Get the last vote of a user for a specific unit** (within a group)  
3) **Get the last vote of a user in general** (optionally filtered by group)

All endpoints follow the existing architecture:

- **repo**: SQL queries only  
- **service**: business logic + fallback logic  
- **controller**: HTTP parsing + validation  
- **route**: Express router wiring  

---

# 0) Assumptions (existing tables)

This document assumes you already have:

- `ranking_vote`
- `ranking_daily_snapshot`
- `ranking_daily_snapshot_item`
- `ranking_group` (+ `ranking_group_text` for i18n)
- `unit`

And you already use snapshot fallback logic.

---

# 1) New API Routes

## 1.1 Get current rank of a unit (from snapshots)

**Route**
```
GET /ranking/:groupId/unit/:unitId
```

**Query params**
- `date` (optional) → `YYYY-MM-DD`
  - if not provided, use **today** (UTC recommended)

**Response (ranked)**
```json
{
  "groupId": "pvp",
  "unitId": "DBL91-01S",
  "date": "2026-02-13",
  "snapshotDateUsed": "2026-02-13",
  "position": 3,
  "avgRank": 2.91,
  "votesCount": 144,
  "score": 2.91
}
```

**Response (not ranked)**
```json
{
  "groupId": "pvp",
  "unitId": "DBL91-01S",
  "date": "2026-02-13",
  "snapshotDateUsed": "2026-02-12",
  "position": null
}
```

---

## 1.2 Get last vote of a user for a specific unit

**Route**
```
GET /ranking/:groupId/user/:userId/unit/:unitId/last-vote
```

**Response**
```json
{
  "groupId": "pvp",
  "userId": "user_x",
  "unitId": "DBL91-01S",
  "date": "2026-02-12",
  "rankPosition": 4,
  "updatedAt": "2026-02-12 10:40:21"
}
```

If user never voted for that unit:
```json
{
  "groupId": "pvp",
  "userId": "user_x",
  "unitId": "DBL91-01S",
  "lastVote": null
}
```

---

## 1.3 Get last vote of a user (general)

**Route**
```
GET /ranking/user/:userId/last-vote
```

**Query params**
- `groupId` (optional) → if provided, restrict search to that group

**Response**
```json
{
  "userId": "user_x",
  "groupId": "pvp",
  "unitId": "DBL91-01S",
  "date": "2026-02-12",
  "rankPosition": 4,
  "updatedAt": "2026-02-12 10:40:21"
}
```

If user never voted:
```json
{
  "userId": "user_x",
  "lastVote": null
}
```

---

# 2) SQLite Indexes (Recommended)

These queries will be hit often, so add indexes.

```sql
CREATE INDEX IF NOT EXISTS idx_ranking_vote_user_group_updated
ON ranking_vote(user_id, ranking_group_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_ranking_vote_user_unit_updated
ON ranking_vote(user_id, unit_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_ranking_vote_user_group_unit_updated
ON ranking_vote(user_id, ranking_group_id, unit_id, updated_at);
```

> Note: `updated_at` is TEXT, but since it is stored as `YYYY-MM-DD HH:MM:SS`, sorting works correctly.

---

# 3) Repo Layer (SQL only)

## 3.1 File
Create/extend:
```
src/ranking/ranking.repo.ts
```

---

## 3.2 Snapshot fallback helpers

### 3.2.1 Get best snapshot date (same logic as ranking list)
```ts
import { db } from "../db/sqlite";

export function getBestSnapshotDate(params: {
  rankingGroupId: string;
  date: string; // YYYY-MM-DD
}) {
  // Prefer same date snapshot if it has items
  const sameDateHasItems = db.prepare(`
    SELECT s.date
    FROM ranking_daily_snapshot s
    JOIN ranking_daily_snapshot_item i
      ON i.ranking_group_id = s.ranking_group_id
     AND i.date = s.date
    WHERE s.ranking_group_id = ?
      AND s.date = ?
    LIMIT 1;
  `).get(params.rankingGroupId, params.date) as { date: string } | undefined;

  if (sameDateHasItems) return sameDateHasItems.date;

  // Otherwise fallback to the last snapshot <= date that has items
  const fallback = db.prepare(`
    SELECT s.date
    FROM ranking_daily_snapshot s
    JOIN ranking_daily_snapshot_item i
      ON i.ranking_group_id = s.ranking_group_id
     AND i.date = s.date
    WHERE s.ranking_group_id = ?
      AND s.date <= ?
    ORDER BY s.date DESC
    LIMIT 1;
  `).get(params.rankingGroupId, params.date) as { date: string } | undefined;

  return fallback?.date ?? null;
}
```

---

## 3.3 Get unit rank from snapshot

```ts
export function getUnitRankFromSnapshot(params: {
  rankingGroupId: string;
  snapshotDate: string; // YYYY-MM-DD
  unitId: string;
}) {
  const row = db.prepare(`
    SELECT
      position,
      score,
      avg_rank,
      votes_count
    FROM ranking_daily_snapshot_item
    WHERE ranking_group_id = ?
      AND date = ?
      AND unit_id = ?
    LIMIT 1;
  `).get(params.rankingGroupId, params.snapshotDate, params.unitId) as
    | {
        position: number;
        score: number;
        avg_rank: number;
        votes_count: number;
      }
    | undefined;

  return row ?? null;
}
```

---

## 3.4 Get last vote of a user for a unit (inside group)

```ts
export function getLastVoteForUserUnit(params: {
  userId: string;
  rankingGroupId: string;
  unitId: string;
}) {
  const row = db.prepare(`
    SELECT
      user_id,
      ranking_group_id,
      unit_id,
      date,
      rank_position,
      updated_at
    FROM ranking_vote
    WHERE user_id = ?
      AND ranking_group_id = ?
      AND unit_id = ?
    ORDER BY date DESC, updated_at DESC
    LIMIT 1;
  `).get(params.userId, params.rankingGroupId, params.unitId) as
    | {
        user_id: string;
        ranking_group_id: string;
        unit_id: string;
        date: string;
        rank_position: number;
        updated_at: string;
      }
    | undefined;

  return row ?? null;
}
```

---

## 3.5 Get last vote of a user (general)

### Option A: Across all groups
```ts
export function getLastVoteForUser(params: {
  userId: string;
}) {
  const row = db.prepare(`
    SELECT
      user_id,
      ranking_group_id,
      unit_id,
      date,
      rank_position,
      updated_at
    FROM ranking_vote
    WHERE user_id = ?
    ORDER BY date DESC, updated_at DESC
    LIMIT 1;
  `).get(params.userId) as
    | {
        user_id: string;
        ranking_group_id: string;
        unit_id: string;
        date: string;
        rank_position: number;
        updated_at: string;
      }
    | undefined;

  return row ?? null;
}
```

### Option B: Filter by group
```ts
export function getLastVoteForUserInGroup(params: {
  userId: string;
  rankingGroupId: string;
}) {
  const row = db.prepare(`
    SELECT
      user_id,
      ranking_group_id,
      unit_id,
      date,
      rank_position,
      updated_at
    FROM ranking_vote
    WHERE user_id = ?
      AND ranking_group_id = ?
    ORDER BY date DESC, updated_at DESC
    LIMIT 1;
  `).get(params.userId, params.rankingGroupId) as
    | {
        user_id: string;
        ranking_group_id: string;
        unit_id: string;
        date: string;
        rank_position: number;
        updated_at: string;
      }
    | undefined;

  return row ?? null;
}
```

---

# 4) Service Layer (business logic)

## 4.1 File
Create/extend:
```
src/ranking/ranking.service.ts
```

---

## 4.2 Helper: Normalize date

You must standardize dates.

**Rule**
- API accepts `YYYY-MM-DD`
- If missing, use UTC today

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

## 4.3 Get current unit rank

This MUST apply snapshot fallback.

```ts
import * as repo from "./ranking.repo";

export function getUnitCurrentRank(params: {
  rankingGroupId: string;
  unitId: string;
  date?: string;
}) {
  const targetDate = params.date ?? getTodayUTCDateString();

  const snapshotDateUsed = repo.getBestSnapshotDate({
    rankingGroupId: params.rankingGroupId,
    date: targetDate
  });

  if (!snapshotDateUsed) {
    return {
      groupId: params.rankingGroupId,
      unitId: params.unitId,
      date: targetDate,
      snapshotDateUsed: null,
      position: null
    };
  }

  const rankRow = repo.getUnitRankFromSnapshot({
    rankingGroupId: params.rankingGroupId,
    snapshotDate: snapshotDateUsed,
    unitId: params.unitId
  });

  if (!rankRow) {
    return {
      groupId: params.rankingGroupId,
      unitId: params.unitId,
      date: targetDate,
      snapshotDateUsed,
      position: null
    };
  }

  return {
    groupId: params.rankingGroupId,
    unitId: params.unitId,
    date: targetDate,
    snapshotDateUsed,
    position: rankRow.position,
    avgRank: rankRow.avg_rank,
    votesCount: rankRow.votes_count,
    score: rankRow.score
  };
}
```

---

## 4.4 Get last vote for user + unit

```ts
export function getUserLastVoteForUnit(params: {
  rankingGroupId: string;
  userId: string;
  unitId: string;
}) {
  const row = repo.getLastVoteForUserUnit(params);

  if (!row) {
    return {
      groupId: params.rankingGroupId,
      userId: params.userId,
      unitId: params.unitId,
      lastVote: null
    };
  }

  return {
    groupId: row.ranking_group_id,
    userId: row.user_id,
    unitId: row.unit_id,
    date: row.date,
    rankPosition: row.rank_position,
    updatedAt: row.updated_at
  };
}
```

---

## 4.5 Get last vote for user (general)

```ts
export function getUserLastVote(params: {
  userId: string;
  rankingGroupId?: string;
}) {
  const row = params.rankingGroupId
    ? repo.getLastVoteForUserInGroup({
        userId: params.userId,
        rankingGroupId: params.rankingGroupId
      })
    : repo.getLastVoteForUser({ userId: params.userId });

  if (!row) {
    return {
      userId: params.userId,
      lastVote: null
    };
  }

  return {
    userId: row.user_id,
    groupId: row.ranking_group_id,
    unitId: row.unit_id,
    date: row.date,
    rankPosition: row.rank_position,
    updatedAt: row.updated_at
  };
}
```

---

# 5) Controller Layer (HTTP)

## 5.1 File
Create/extend:
```
src/ranking/ranking.controller.ts
```

---

## 5.2 Validation helper

```ts
export function isValidDateYYYYMMDD(date: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}
```

---

## 5.3 Controller: Get unit rank

```ts
import { Request, Response } from "express";
import * as service from "./ranking.service";
import { isValidDateYYYYMMDD } from "./ranking.validation";

export function getUnitRank(req: Request, res: Response) {
  const { groupId, unitId } = req.params;
  const date = req.query.date as string | undefined;

  if (date && !isValidDateYYYYMMDD(date)) {
    return res.status(400).json({ error: "Invalid date (YYYY-MM-DD)" });
  }

  const data = service.getUnitCurrentRank({
    rankingGroupId: groupId,
    unitId,
    date
  });

  return res.json(data);
}
```

---

## 5.4 Controller: Get last vote for user + unit

```ts
export function getUserLastVoteForUnit(req: Request, res: Response) {
  const { groupId, userId, unitId } = req.params;

  const data = service.getUserLastVoteForUnit({
    rankingGroupId: groupId,
    userId,
    unitId
  });

  return res.json(data);
}
```

---

## 5.5 Controller: Get last vote for user (general)

```ts
export function getUserLastVote(req: Request, res: Response) {
  const { userId } = req.params;
  const groupId = req.query.groupId as string | undefined;

  const data = service.getUserLastVote({
    userId,
    rankingGroupId: groupId
  });

  return res.json(data);
}
```

---

# 6) Routes Layer (Express Router)

## 6.1 File
Create/extend:
```
src/ranking/ranking.routes.ts
```

---

## 6.2 Routes

```ts
import { Router } from "express";
import * as controller from "./ranking.controller";

export const rankingRouter = Router();

// existing routes...
// rankingRouter.get("/:groupId", controller.getRanking);
// rankingRouter.post("/vote", controller.submitVote);
// rankingRouter.post("/snapshot/generate", controller.generateSnapshot);

// NEW: unit rank
rankingRouter.get("/:groupId/unit/:unitId", controller.getUnitRank);

// NEW: last vote of user for unit
rankingRouter.get(
  "/:groupId/user/:userId/unit/:unitId/last-vote",
  controller.getUserLastVoteForUnit
);

// NEW: last vote of user general (optionally filtered by group)
rankingRouter.get("/user/:userId/last-vote", controller.getUserLastVote);
```

---

# 7) Notes / Best Practices

## 7.1 Why use snapshots for unit rank?
Because:
- your ranking is snapshot-based
- you already have fallback logic
- the unit rank must match what the UI shows in the top list

So you should NEVER compute the unit rank live from votes.

---

## 7.2 "Last vote" queries should read from `ranking_vote`
Because snapshots represent aggregated community state, not per-user state.

---

## 7.3 Sorting last votes
We sort by:
- `date DESC`
- `updated_at DESC`

This ensures:
- latest day wins
- if multiple updates happened on the same day, the latest update wins

---

# 8) Final Checklist

- [ ] Add indexes
- [ ] Implement repo functions
- [ ] Implement service functions
- [ ] Implement controllers
- [ ] Add routes
- [ ] Test using Postman / Insomnia
- [ ] Confirm fallback snapshot behavior
- [ ] Confirm last-vote queries return expected rows

---

# 9) Example Calls

## Get unit rank
```
GET /ranking/pvp/unit/DBL91-01S?date=2026-02-13
```

## Get last vote of user for unit
```
GET /ranking/pvp/user/user_x/unit/DBL91-01S/last-vote
```

## Get last vote of user general
```
GET /ranking/user/user_x/last-vote
```

## Get last vote of user general (filtered by group)
```
GET /ranking/user/user_x/last-vote?groupId=pvp
```
