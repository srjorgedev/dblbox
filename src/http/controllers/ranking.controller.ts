import { Request, Response } from "express";
import { RankingService } from "@/domain/service/ranking.service";

export class RankingController {
  private readonly rankingService: RankingService;

  constructor(rankingService: RankingService) {
    this.rankingService = rankingService;
  }

  async getGroups(req: Request, res: Response) {
    const lang = String(req.query.lang || "en");
    const groups = await this.rankingService.getGroups(lang);
    return res.status(200).json(groups);
  }

  async submitVote(req: Request, res: Response) {
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

    await this.rankingService.submitVote({
      userId,
      rankingGroupId,
      unitId,
      date,
      rankPosition: rank
    });

    return res.status(200).json({ ok: true });
  }

  async generateSnapshot(req: Request, res: Response) {
    const rankingGroupId = String(req.body.rankingGroupId);
    const date = String(req.body.date);
    const windowDays = Number(req.body.windowDays || 14);

    if (!rankingGroupId || !date) {
      return res.status(400).json({ error: "Missing rankingGroupId or date" });
    }

    if (!Number.isInteger(windowDays) || windowDays < 1 || windowDays > 90) {
      return res.status(400).json({ error: "Invalid windowDays" });
    }

    await this.rankingService.generateSnapshot({ rankingGroupId, date, windowDays });
    return res.status(200).json({ ok: true });
  }

  async getRanking(req: Request, res: Response) {
    const rankingGroupId = String(req.params.groupId);
    const date = String(req.query.date || new Date().toISOString().slice(0, 10));

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Invalid date format (YYYY-MM-DD)" });
    }

    const result = await this.rankingService.getRankingForDate({ rankingGroupId, date });

    return res.status(200).json({
      rankingGroupId,
      date,
      usedSnapshotDate: result.usedSnapshotDate,
      items: result.items
    });
  }

  async getUnitRank(req: Request, res: Response) {
    const groupId = String(req.params.groupId);
    const unitId = String(req.params.unitId);
    const date = req.query.date as string | undefined;

    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: "Invalid date format (YYYY-MM-DD)" });
    }

    const data = await this.rankingService.getUnitCurrentRank({
      rankingGroupId: groupId,
      unitId,
      date
    });

    return res.status(200).json(data);
  }

  async getUserLastVoteForUnit(req: Request, res: Response) {
    const groupId = String(req.params.groupId);
    const userId = String(req.params.userId);
    const unitId = String(req.params.unitId);

    const data = await this.rankingService.getUserLastVoteForUnit({
      rankingGroupId: groupId,
      userId,
      unitId
    });

    return res.status(200).json(data);
  }

  async getUserLastVote(req: Request, res: Response) {
    const userId = String(req.params.userId);
    const groupId = req.query.groupId as string | undefined;

    const data = await this.rankingService.getUserLastVote({
      userId,
      rankingGroupId: groupId
    });

    return res.status(200).json(data);
  }
}
