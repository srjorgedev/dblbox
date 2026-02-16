import { RankingRepo, RankingVoteParams } from "@/domain/repository/ranking.repo";
import { RankQueries } from "@/domain/repository/queries/rank.query";
import { parseUnitData } from "@/utils/unit.parser";

export class RankingService {
  private readonly rankingRepo: RankingRepo;

  constructor(rankingRepo: RankingRepo) {
    this.rankingRepo = rankingRepo;
  }

  async getGroups(lang: string) {
    return await this.rankingRepo.getGroups(lang);
  }

  async submitVote(params: RankingVoteParams) {
    await this.rankingRepo.upsertVote(params);
  }

  async generateSnapshot(params: {
    rankingGroupId: string;
    date: string;
    windowDays: number;
  }) {
    // 1. Compute rows first, as it's a read operation.
    const rows = await this.rankingRepo.computeRankingRows(params);

    // 2. Build a batch of write statements for a single transaction.
    const statements: { sql: string; args: any[] }[] = [];

    // Delete existing snapshot
    statements.push({ sql: RankQueries.DeleteSnapshotItems, args: [params.rankingGroupId, params.date] });
    statements.push({ sql: RankQueries.DeleteSnapshotHeader, args: [params.rankingGroupId, params.date] });

    // Insert new header only if there are rows to prevent empty snapshots
    if (rows.length > 0) {
      statements.push({
        sql: RankQueries.InsertSnapshotHeader,
        args: [params.rankingGroupId, params.date, params.windowDays]
      });

      // Insert new items
      rows.forEach((row, index) => {
        statements.push({
          sql: RankQueries.InsertSnapshotItem,
          args: [
            params.rankingGroupId,
            params.date,
            row.unit_id,
            row.avg_rank, // score
            row.avg_rank,
            row.votes_count,
            index + 1 // position
          ]
        });
      });
    }

    // 3. Execute the batch transaction.
    if (statements.length > 2) { // Only run if there's more than just delete statements
      await this.rankingRepo.executeBatch(statements);
    }
  }

  async getRankingForDate(params: {
    rankingGroupId: string;
    date: string;
  }) {
    const bestDate = await this.rankingRepo.getBestSnapshotDate(params);

    if (!bestDate) {
      return {
        usedSnapshotDate: null,
        items: []
      };
    }

    const items = await this.rankingRepo.getSnapshotItems({
      rankingGroupId: params.rankingGroupId,
      date: bestDate
    });

    if (items.length === 0) {
      return {
        usedSnapshotDate: bestDate,
        items: []
      };
    }

    const windowDays = await this.rankingRepo.getSnapshotWindow(params.rankingGroupId, bestDate);
    if (!windowDays) {
      // If no window info, return items without distribution
      return { usedSnapshotDate: bestDate, items };
    }

    const unitIds = items.map(item => item.unit_id);
    const windowEndDate = bestDate;
    const windowStartDate = new Date(bestDate);
    windowStartDate.setDate(windowStartDate.getDate() - (windowDays - 1));
    const startDateString = windowStartDate.toISOString().slice(0, 10);

    const distributions = await this.rankingRepo.getVoteDistributionsForUnits({
      rankingGroupId: params.rankingGroupId,
      unitIds,
      startDate: startDateString,
      endDate: windowEndDate
    });

    const distMap = new Map(distributions.map(d => [d.unit_id, d.vote_positions]));

    const formattedItems = items.map(item => {
      const vote_positions = distMap.get(item.unit_id) || null;
      return {
        ...item,
        voteDistribution: this._formatVoteDistribution(vote_positions)
      }
    });

    return {
      usedSnapshotDate: bestDate,
      items: formattedItems
    };
  }

  private _formatVoteDistribution(voteString: string | null): { top: number, count: number }[] {
    if (!voteString) return [];

    const positions = voteString.split(',');
    const distribution: Record<string, number> = {};

    for (const pos of positions) {
      if (distribution[pos]) {
        distribution[pos]++;
      } else {
        distribution[pos] = 1;
      }
    }

    return Object.entries(distribution)
      .map(([rank, count]) => ({ top: Number(rank), count: count }))
      .sort((a, b) => a.top - b.top);
  }

  getTodayUTCDateString() {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  async getUnitCurrentRank(params: {
    rankingGroupId: string;
    unitId: string;
    date?: string;
  }) {
    const targetDate = params.date ?? this.getTodayUTCDateString();

    const snapshotDateUsed = await this.rankingRepo.getBestSnapshotDate({
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

    const rankRow = await this.rankingRepo.getUnitRankFromSnapshot({
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

    const windowDays = await this.rankingRepo.getSnapshotWindow(params.rankingGroupId, snapshotDateUsed);
    let voteDistribution: { top: number, count: number }[] = [];
    if (windowDays) {
      const windowEndDate = snapshotDateUsed;
      const windowStartDate = new Date(snapshotDateUsed);
      windowStartDate.setDate(windowStartDate.getDate() - (windowDays - 1));
      const startDateString = windowStartDate.toISOString().slice(0, 10);

      const distributions = await this.rankingRepo.getVoteDistributionsForUnits({
        rankingGroupId: params.rankingGroupId,
        unitIds: [params.unitId],
        startDate: startDateString,
        endDate: windowEndDate
      });

      if (distributions.length > 0) {
        voteDistribution = this._formatVoteDistribution(distributions[0].vote_positions);
      }
    }

    return {
      groupId: params.rankingGroupId,
      unitId: params.unitId,
      date: targetDate,
      snapshotDateUsed,
      position: rankRow.position,
      avgRank: rankRow.avg_rank,
      votesCount: rankRow.votes_count,
      score: rankRow.score,
      voteDistribution
    };
  }

  async getUserLastVoteForUnit(params: {
    rankingGroupId: string;
    userId: string;
    unitId: string;
  }) {
    const row = await this.rankingRepo.getLastVoteForUserUnit(params);

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

  async getUserLastVote(params: {
    userId: string;
    rankingGroupId?: string;
  }) {
    const row = params.rankingGroupId
      ? await this.rankingRepo.getLastVoteForUserInGroup({
        userId: params.userId,
        rankingGroupId: params.rankingGroupId
      })
      : await this.rankingRepo.getLastVoteForUser({ userId: params.userId });

    if (!row) {
      return {
        userId: params.userId,
        lastVote: null
      };
    }

    return {
      userId: row.user_id,
      lastvote: {
        groupId: row.ranking_group_id,
        unitId: row.unit_id,
        date: row.date,
        rankPosition: row.rank_position,
        updatedAt: row.updated_at
      }
    };
  }

  async getLiveTopRanking(params: {
    rankingGroupId: string;
    date?: string;
    windowDays?: number;
    limit?: number;
  }, lang: string) {
    const date = params.date ?? this.getTodayUTCDateString();
    const windowDays = params.windowDays ?? 14;
    const limit = params.limit ?? 100;

    const rows = await this.rankingRepo.getLiveTopRankingRows({
      rankingGroupId: params.rankingGroupId,
      date,
      windowDays,
      limit,
    }, lang);

    const items = rows.map((row, idx) => {
      const unit = parseUnitData({ unit_id: row.unit_id, chapter_texts: row.chapter_texts, color_texts: row.color_texts, fusion: row.fusion, lf: row.lf, rarity_texts: row.rarity_texts, tag_texts: row.tag_texts, tagswitch: row.tagswitch, transform: row.transform, type_texts: row.type_texts, unit_names: row.unit_names, unit_num: row.unit_num, zenkai: row.zenkai })

      return {
        position: idx + 1,
        avgRank: row.avg_rank,
        votesCount: row.votes_count,
        unit
      }
    })

    return {
      rankingGroupId: params.rankingGroupId,
      date,
      windowDays,
      items
    };
  }

  async getLiveUnitRank(params: {
    rankingGroupId: string;
    unitId: string;
    date?: string;
    windowDays?: number;
  }) {
    const date = params.date ?? this.getTodayUTCDateString();
    const windowDays = params.windowDays ?? 14;

    const row = await this.rankingRepo.getLiveUnitRankRow({
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

  async voteLiveAndReturnFeedback(params: {
    rankingGroupId: string;
    userId: string;
    unitId: string;
    rankPosition: number;
    date?: string;
    windowDays?: number;
  }) {
    const date = params.date ?? this.getTodayUTCDateString();
    const windowDays = params.windowDays ?? 14;

    // Save vote
    await this.rankingRepo.upsertVote({
      userId: params.userId,
      rankingGroupId: params.rankingGroupId,
      unitId: params.unitId,
      date,
      rankPosition: params.rankPosition
    });

    // Return immediate rank feedback
    const liveRank = await this.getLiveUnitRank({
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
        avgRank: (liveRank as any).avgRank ?? null,
        votesCount: (liveRank as any).votesCount ?? null
      }
    };
  }
}
