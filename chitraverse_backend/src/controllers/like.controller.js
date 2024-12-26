import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.models.js";

const toogleVideoLike = asyncHandler(async (req, res) => {
  const { id: videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video Id Invalid or Missing");
  }

  const userId = req.user._id;

  if (!userId) {
    throw new apiError(400, "Unauthorized User");
  }

  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new apiResponse(200, "Video Unliked Successfully"));
  } else {
    const newLike = await Like.create({
      video: videoId,
      likedBy: userId,
    });

    return res
    .status(200)
    .json(new apiResponse(200, newLike, "Video Liked Successfully"));
  }
});

export {toogleVideoLike}