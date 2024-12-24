import { Router } from "express";
import {upload} from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishVideos,
  tooglePublishStatus,
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
router.route("/viewvideo/:id").post(verifyJWT, getVideoById); // Routes to view individual Video Using Video Id
router.route("/update/:id").post(verifyJWT, updateVideo); // Routes to update individual videos using Video Id
router.route("/delete/:id").post(verifyJWT, deleteVideo); // Routes to delete individual videos using Video Id
router.route("/tooglepublish/:id").post(verifyJWT, tooglePublishStatus); // Routes to toogle publish status of video using Video Id

export default router;
