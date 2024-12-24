import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createTweet } from "../controllers/tweet.controller.js";
import { getUserTweets } from "../controllers/tweet.controller.js";
const router = Router();

router.route("/create").post(verifyJWT, createTweet);
router.route("/gettweets").post(verifyJWT, getUserTweets);

export default router;
