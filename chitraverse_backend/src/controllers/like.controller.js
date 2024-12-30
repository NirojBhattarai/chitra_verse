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

  try {
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
  } catch (error) {
    console.log(400,"Error while toogling video like", error);
    throw new apiError(400, "Something went wrong while toogling video like");
  }
});

const toogleCommentLike = asyncHandler(async(req, res) =>{
  const {id:commentId} = req.params;
  
  if(!commentId){
    throw new apiError(400, "Invalid or Missing Comment Id");
  }

  const userId = req.user._id;

  if(!userId){
    throw new apiError(400, "Authorization Error");
  }

  try {
     const existingLike = await Like.findOne({comment:commentId, likedBy:userId});

     if(existingLike){
      await Like.findByIdAndDelete(existingLike._id);
      return res
      .status(200)
      .json(new apiResponse(200,"Comment Unliked Successfully"));
     }
     else{
      const newLike = await Like.create({
        comment:commentId,
        likedBy:userId
      });

      if(!newLike){
        throw new apiError(400, "Error while liking comment");
      }

      return res
      .status(200)
      .json(new apiError(200, newLike, "Comment Liked Successfully"));
     }
  } catch (error) {
    console.log("Error while toogling comment like", error);
    throw new apiError(400, "Error while toogling comment like" );
  }

  
})

const toogleTweetLike = asyncHandler(async(req, res) => {
  const {id:tweetId} = req.params;

  if(!tweetId){
    throw new apiError(400, "Invalid Tweet Id");
  }

  const userId = req.user._id;

  if(!userId){
    throw new apiError(400, "Invalid or Missing User Id");
  }

  try {
    const existingLike = await Like.find({tweet:tweetId, likedBy:userId});

    if(existingLike){
      await Like.findByIdAndDelete(existingLike._id);
      throw new apiResponse(200, "Tweet Unliked Successfully");
    }
    else{
      const newLike = await Like.create(
        {
          tweet:tweetId,
          likedBy:userId
        }
      );

      return res
      .status(200)
      .json(new apiResponse(200, newLike, "Tweet liked successfully"));
    }
  } catch (error) {
    console.log("Error while Toogling Like in Tweets");
    throw new apiError(400,"Something went wrong while Toogling like in Tweets");
  }
});

export {toogleVideoLike, toogleCommentLike, toogleTweetLike}