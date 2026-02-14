import { Router } from "express";
import { RankingController } from "@/http/controllers/ranking.controller";
import { asyncHandler } from "@/utils/asyncHandler";

export default function createRankingRoutes(rankingController: RankingController) {
  const ROUTER = Router();

  ROUTER.get("/groups", asyncHandler((req, res) => rankingController.getGroups(req, res)));
  ROUTER.post("/vote", asyncHandler((req, res) => rankingController.submitVote(req, res)));
  ROUTER.post("/snapshot/generate", asyncHandler((req, res) => rankingController.generateSnapshot(req, res)));
  ROUTER.get("/:groupId", asyncHandler((req, res) => rankingController.getRanking(req, res)));

  // NEW: unit rank
  ROUTER.get("/:groupId/unit/:unitId", asyncHandler((req, res) => rankingController.getUnitRank(req, res)));

  // NEW: last vote of user for unit
  ROUTER.get(
    "/:groupId/user/:userId/unit/:unitId/last-vote",
    asyncHandler((req, res) => rankingController.getUserLastVoteForUnit(req, res))
  );

  // NEW: last vote of user general (optionally filtered by group)
  ROUTER.get("/user/:userId/last-vote", asyncHandler((req, res) => rankingController.getUserLastVote(req, res)));

  return ROUTER;
}
