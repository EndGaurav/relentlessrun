import { Router } from "express";
import { lookupPrizeByBib, myPrizes } from "../controllers/prize.controller.js";
import { requireClerkAuth } from "../middleware/clerk-auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const prizeRouter = Router();

prizeRouter.get("/my", requireClerkAuth, asyncHandler(myPrizes));
prizeRouter.get("/:bibNumber", asyncHandler(lookupPrizeByBib));
