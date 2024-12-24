import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getAllVideos,
  getVideoById,
  publishVideos,
  updateVideo,
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
router.route("/view/:id").post(verifyJWT, getVideoById); // Routes to view individual Video Using Video Id
router.route("/update/:id").post(verifyJWT, updateVideo); // Routes to update individual videos using Video Id

export default router;
