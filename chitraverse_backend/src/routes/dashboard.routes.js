import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/getchannelstats").post(verifyJWT, getChannelStats);
router.route("/getchannelvideos").post(verifyJWT, getChannelVideos);

export default router;
