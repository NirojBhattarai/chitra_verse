import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { toogleCommentLike, toogleVideoLike, toogleTweetLike,getLikedVideos } from "../controllers/like.controller.js";

const router = Router();

router.route('/likevideo/:id').post(verifyJWT,toogleVideoLike);
router.route('/likecomment/:id').post(verifyJWT,toogleCommentLike);
router.route('/liketweet/:id').post(verifyJWT,toogleTweetLike);
router.route('/viewlikedvideos').post(verifyJWT,getLikedVideos);

export default router;