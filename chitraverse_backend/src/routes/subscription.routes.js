import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { getSubscribedChannels, getUserChannelSubscribers, toogleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/tooglesubscription/:id").post(verifyJWT, toogleSubscription);
router.route("/getsubscribers/:id").post(verifyJWT, getUserChannelSubscribers);
router.route("/getsubscriptions").post(verifyJWT, getSubscribedChannels);

export default router;