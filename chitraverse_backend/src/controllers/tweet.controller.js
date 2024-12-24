import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Tweet } from "../models/tweet.models.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new apiError(400, "Content is Required");
  }

  try {
    const tweet = await Tweet.create({
      content,
      owner: req.user._id,
    });

    if (!tweet) {
      throw new apiError(400, "Tweet creation Failed");
    }

    return res
      .status(201)
      .json(new apiResponse(201, tweet, "Tweet Created Successfully"));
  } catch (error) {
    console.log("Something went wrong while creating tweet", error);
    throw new apiError(400, "Error While Creating Tweet");
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  const _id = req.user._id;

  if (!_id) {
    throw new apiError(400, "Unauthorized Request");
  }

  try {
    const tweet = await Tweet.find({
      owner: _id,
    });

    if (!tweet) {
      throw new apiError(404, "Tweet Not Found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, tweet, "User's Tweet Fetched Successfully"));
  } catch (error) {
    console.log("Error while fetching tweets", error);
    throw new apiError(400, "Error While Fetching User's Tweet");
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  const { id: _id } = req.params;

  if (!_id) {
    throw new apiError(400, "Tweet Id is invalid or Missing");
  }

  const { content } = req.body;

  if (!content) {
    throw new apiError(400, "Content is Required");
  }

  try {
    const tweet = await Tweet.findByIdAndUpdate(
      _id,
      {
        content,
      },
      {
        new: true,
      }
    );

    if (!tweet) {
      throw new apiError(400, "Tweet Update Failed");
    }

    return res
      .status(200)
      .json(new apiResponse(200, tweet, "Tweet Updated Successfully"));
  } catch (error) {
    console.log("Error while Updating Tweet", error);
    throw new apiError(400, "Something went wrong while Updating Tweet");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  const {id: _id} = req.params;

  if(!_id){
    throw new apiError(400, "Invalid Tweet Id or Missing")
  }

  try {
    const tweet = await Tweet.findByIdAndDelete(_id);

    if(!tweet){
      throw new apiError(400, "Tweet Deletion Failed or Already Deleted");
    }

    return res
    .status(200)
    .json(new apiResponse(200,"Tweet Deleted Successfully"));
  } catch (error) {
    console.log("Error while deleting tweet", error);
    throw new apiError(400, "Error Deleting Tweets");
  }

});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
