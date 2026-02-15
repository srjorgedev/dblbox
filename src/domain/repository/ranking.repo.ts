import { Client } from "@libsql/client";
import { RankQueries } from "./queries/rank.query";

export interface RankingGroup {
  _id: string;
  title: string;
  description: string | null;
}

export interface RankingVoteParams {
  userId: string;
  rankingGroupId: string;
  unitId: string;
  date: string;
  rankPosition: number;
}

export interface RankingRow {
  unit_id: string;
  avg_rank: number;
  votes_count: number;
}

export interface SnapshotItem {
  position: number;
  unit_id: string;
  score: number;
  avg_rank: number;
  votes_count: number;
}

export class RankingRepo {
  private readonly db: Client;

  constructor(db: Client) {
    this.db = db;
  }

  async getGroups(lang: string): Promise<RankingGroup[]> {
    const r = await this.db.execute({
      sql: RankQueries.GetGroups,
      args: [lang]
    });
    return r.rows as unknown as RankingGroup[];
  }

  async upsertVote(params: RankingVoteParams): Promise<void> {
    await this.db.execute({
      sql: RankQueries.UpsertVote,
      args: [
        params.userId,
        params.rankingGroupId,
        params.unitId,
        params.date,
        params.rankPosition
      ]
    });
  }

  async computeRankingRows(params: {
    rankingGroupId: string;
    date: string;
    windowDays: number;
  }): Promise<RankingRow[]> {
    const r = await this.db.execute({
      sql: RankQueries.ComputeRankingRows,
      args: [
        params.rankingGroupId,
        params.date,
        params.windowDays,
        params.date
      ]
    });
    return r.rows as unknown as RankingRow[];
  }

  async deleteSnapshot(params: { rankingGroupId: string; date: string }): Promise<void> {
    await this.db.batch([
      {
        sql: RankQueries.DeleteSnapshotItems,
        args: [params.rankingGroupId, params.date]
      },
      {
        sql: RankQueries.DeleteSnapshotHeader,
        args: [params.rankingGroupId, params.date]
      }
    ], "write");
  }

  async insertSnapshotHeader(params: {
    rankingGroupId: string;
    date: string;
    windowDays: number;
  }): Promise<void> {
    await this.db.execute({
      sql: RankQueries.InsertSnapshotHeader,
      args: [params.rankingGroupId, params.date, params.windowDays]
    });
  }

  async insertSnapshotItem(params: {
    rankingGroupId: string;
    date: string;
    unitId: string;
    position: number;
    avgRank: number;
    votesCount: number;
    score: number;
  }): Promise<void> {
    await this.db.execute({
      sql: RankQueries.InsertSnapshotItem,
      args: [
        params.rankingGroupId,
        params.date,
        params.unitId,
        params.score,
        params.avgRank,
        params.votesCount,
        params.position
      ]
    });
  }

  async getBestSnapshotDate(params: {
    rankingGroupId: string;
    date: string;
  }): Promise<string | undefined> {
    const r = await this.db.execute({
      sql: RankQueries.GetBestSnapshotDate,
      args: [params.rankingGroupId, params.date]
    });
    if (r.rows.length === 0) return undefined;
    return r.rows[0].date as string;
  }

  async getSnapshotItems(params: {
    rankingGroupId: string;
    date: string;
  }): Promise<SnapshotItem[]> {
    const r = await this.db.execute({
      sql: RankQueries.GetSnapshotItems,
      args: [params.rankingGroupId, params.date]
    });
    return r.rows as unknown as SnapshotItem[];
  }

  async getUnitRankFromSnapshot(params: {
    rankingGroupId: string;
    snapshotDate: string;
    unitId: string;
  }): Promise<SnapshotItem | null> {
    const r = await this.db.execute({
      sql: RankQueries.GetUnitRankFromSnapshot,
      args: [params.rankingGroupId, params.snapshotDate, params.unitId]
    });
    if (r.rows.length === 0) return null;
    return r.rows[0] as unknown as SnapshotItem;
  }

  async getSnapshotWindow(rankingGroupId: string, date: string): Promise<number | null> {
    const r = await this.db.execute({
        sql: RankQueries.GetSnapshotWindow,
        args: [rankingGroupId, date]
    });
    if (r.rows.length === 0) return null;
    return r.rows[0].window_days as number;
  }

  async getLiveTopRankingRows(params: {
    rankingGroupId: string;
    date: string;
    windowDays: number;
    limit: number;
  }): Promise<RankingRow[]> {
    const r = await this.db.execute({
      sql: RankQueries.ComputeLiveTopRankingRows,
      args: [
        params.rankingGroupId,
        params.date,
        params.windowDays,
        params.date,
        params.limit
      ]
    });
    return r.rows as unknown as RankingRow[];
  }

  async getLiveUnitRankRow(params: {
    rankingGroupId: string;
    date: string;
    windowDays: number;
    unitId: string;
  }): Promise<{ unit_id: string; avg_rank: number; votes_count: number; position: number } | null> {
    const r = await this.db.execute({
      sql: RankQueries.ComputeLiveUnitRankRow,
      args: [
        params.rankingGroupId,
        params.date,
        params.windowDays,
        params.date,
        params.unitId
      ]
    });
    if (r.rows.length === 0) return null;
    return r.rows[0] as unknown as { unit_id: string; avg_rank: number; votes_count: number; position: number };
  }

  async getVoteDistributionsForUnits(params: {
    rankingGroupId: string;
    unitIds: string[];
    startDate: string;
    endDate: string;
  }): Promise<{ unit_id: string, vote_positions: string }[]> {
    if (params.unitIds.length === 0) {
        return [];
    }
    const placeholders = params.unitIds.map(() => '?').join(',');
    const sql = RankQueries.GetVoteDistributionForUnits.replace('<unit_ids>', placeholders);
    
    const r = await this.db.execute({
        sql,
        args: [params.rankingGroupId, params.startDate, params.endDate, ...params.unitIds]
    });

    return r.rows as unknown as { unit_id: string, vote_positions: string }[];
  }

  async getLastVoteForUserUnit(params: {
    userId: string;
    rankingGroupId: string;
    unitId: string;
  }): Promise<any | null> {
    const r = await this.db.execute({
      sql: RankQueries.GetLastVoteForUserUnit,
      args: [params.userId, params.rankingGroupId, params.unitId]
    });
    if (r.rows.length === 0) return null;
    return r.rows[0];
  }

  async getLastVoteForUser(params: {
    userId: string;
  }): Promise<any | null> {
    const r = await this.db.execute({
      sql: RankQueries.GetLastVoteForUser,
      args: [params.userId]
    });
    if (r.rows.length === 0) return null;
    return r.rows[0];
  }

  async getLastVoteForUserInGroup(params: {
    userId: string;
    rankingGroupId: string;
  }): Promise<any | null> {
    const r = await this.db.execute({
      sql: RankQueries.GetLastVoteForUserInGroup,
      args: [params.userId, params.rankingGroupId]
    });
    if (r.rows.length === 0) return null;
    return r.rows[0];
  }

  async executeBatch(statements: { sql: string; args: any[] }[]): Promise<void> {
      await this.db.batch(statements, "write");
  }
}
