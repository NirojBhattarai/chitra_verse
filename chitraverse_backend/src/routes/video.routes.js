import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {getAllVideos} from "../controllers/video.controller.js"
const router = Router();

router.route('/view').post(verifyJWT, getAllVideos);

export default router;