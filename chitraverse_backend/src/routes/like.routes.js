import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { toogleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route('/likevideo/:id').post(verifyJWT,toogleVideoLike);

export default router;