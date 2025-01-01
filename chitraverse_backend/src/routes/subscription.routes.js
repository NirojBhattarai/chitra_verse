import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { toogleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

router.route("/tooglesubscription/:id").post(verifyJWT, toogleSubscription);

export default router;