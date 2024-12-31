import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createPlaylist, getUserPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.route('/create').post(verifyJWT,createPlaylist);
router.route('/viewplaylist').post(verifyJWT,getUserPlaylist);
router.route('/getplaylist/:id').post(verifyJWT,getUserPlaylist);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         

export default router;