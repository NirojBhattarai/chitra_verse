import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getChannelStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/getchannelstats").post(verifyJWT, getChannelStats);

export default router;
