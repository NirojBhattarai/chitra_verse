import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllVideos,
  publishVideos,
} from "../controllers/video.controller.js";
const router = Router();

// Protected Routes for Videos
router.route("/view").post(verifyJWT, getAllVideos);
router.route("/upload").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  publishVideos
);

export default router;
