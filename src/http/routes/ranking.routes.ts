import { Router } from "express";
import { RankingController } from "@/http/controllers/ranking.controller";
import { asyncHandler } from "@/utils/asyncHandler";

export default function createRankingRoutes(rankingController: RankingController) {
  const ROUTER = Router();

  ROUTER.get("/groups", asyncHandler((req, res) => rankingController.getGroups(req, res)));
  ROUTER.post("/vote", asyncHandler((req, res) => rankingController.submitVote(req, res)));
  ROUTER.post("/snapshot/generate", asyncHandler((req, res) => rankingController.generateSnapshot(req, res)));
  ROUTER.get("/:groupId", asyncHandler((req, res) => rankingController.getRanking(req, res)));

  ROUTER.get("/:groupId/unit/:unitId", asyncHandler((req, res) => rankingController.getUnitRank(req, res)));

  ROUTER.get(
    "/:groupId/user/:userId/unit/:unitId/last-vote",
    asyncHandler((req, res) => rankingController.getUserLastVoteForUnit(req, res))
  );

  ROUTER.get("/user/:userId/last-vote", asyncHandler((req, res) => rankingController.getUserLastVote(req, res)));

  ROUTER.get("/:groupId/live", asyncHandler((req, res) => rankingController.getLiveRanking(req, res)));
  ROUTER.get("/:groupId/live/unit/:unitId", asyncHandler((req, res) => rankingController.getLiveUnitRank(req, res)));
  ROUTER.post("/:groupId/vote-live", asyncHandler((req, res) => rankingController.voteLive(req, res)));

  return ROUTER;
}
