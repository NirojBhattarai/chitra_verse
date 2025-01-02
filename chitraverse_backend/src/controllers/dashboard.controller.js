import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Video } from "../models/video.models.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.models.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  if (!channelId) {
    throw new apiError(400, "Invalid or Missing Channel Id");
  }

  try {
    const totalVideos = await Video.countDocuments({ owner: channelId });
    const totalViews = await Video.aggregate([
      {
        $match: { owner: channelId },
      },
      {
        $group: {
          _id: null,
          totalViews: {
            $sum: "$views",
          },
        },
      },
    ]);

    const totalSubscribers = await Subscription.countDocuments({
      channel: channelId,
    });
    const totalLikes = await Like.countDocuments({
      video: {
        $in: await Video.find({ owner: channelId }).select("_id"),
      },
    });

    const stats = {
      totalVideos,
      totalViews: totalViews[0]?.totalViews || 0,
      totalSubscribers,
      totalLikes,
    };

    return res
      .status(200)
      .json(new apiResponse(200, stats, "Channel Stats Fetched Successfully"));
  } catch (error) {
    console.log("Error while fetching Channel Stats");
    throw new apiError(
      400,
      "Something went wrong while fetching channel stats"
    );
  }
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const  channelId  = req.user._id;

  if (!channelId) {
    throw new apiError(400, "Invalid or Missing Channel Id");
  }

  try {
    const channelvideos = await Video.find({
      owner: channelId,
    });

    if(!channelvideos){
      throw new apiError(400, "Video Not Found in Channel");
    }

    return res
    .status(200)
    .json(new apiResponse(200, channelvideos, "Channel Videos Fetched Successfully"));
  } catch (error) {
    console.log("Error while fetching channel videos");
    throw new apiError(400, "Something went wrong while fetching channel videos");
  }
});

export { getChannelStats, getChannelVideos };
