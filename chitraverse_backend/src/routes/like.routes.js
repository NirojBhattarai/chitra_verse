import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { toogleCommentLike, toogleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route('/likevideo/:id').post(verifyJWT,toogleVideoLike);
router.route('/likecomment/:id').post(verifyJWT,toogleCommentLike);

export default router;