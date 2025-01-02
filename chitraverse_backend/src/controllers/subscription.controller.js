import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Subscription } from "../models/subscription.models.js";

const toogleSubscription = asyncHandler(async (req, res) => {
  const { id: channelId } = req.params;

  if (!channelId) {
    throw new apiError(400, "Channeld is missing or Invalid");
  }

  const userId = req.user._id;

  if (!userId) {
    throw new apiError(400, "Unauthorized User");
  }

  try {
    const existingSubscription = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (existingSubscription) {
      await Subscription.findByIdAndDelete(existingSubscription._id);
      return res
        .status(200)
        .json(new apiResponse(200, "Channel Unsubscribed Successfully"));
    } else {
      const newSubscription = await Subscription.create(
        {
          subscriber: userId,
          channel: channelId,
        },
        {
          new: true,
        }
      );

      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            newSubscription,
            "Channel Subscribed Successfully"
          )
        );
    }
  } catch (error) {
    console.log("Error while subscribing channel", error);
    throw new apiError(400, "Something went wrong while subscribing channel");
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { id: channelId } = req.params;

  if (!channelId) {
    throw new apiError(400, "Invalid or Missing Channel Id");
  }

  try {
    const subscribers = await Subscription.find({ channel: channelId });

    if (!subscribers) {
      throw new apiError(400, "No Subscribers Found");
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, subscribers, "Subscribers Fetched Successfully")
      );
  } catch (error) {
    console.log("Error while fetching subscribers", error);
    throw new apiError(400, "Something went wrong while fetching subscribers");
  }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new apiError(400, "Unauthorized User");
  }

  try {
    const subscribedChannels = await Subscription.find({ subscriber: userId });

    if (!subscribedChannels) {
      throw new apiError(400, "No Subscribed Channels Found");
    }

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          subscribedChannels,
          "Subscribed Channels Fetched Successfully"
        )
      );
  } catch (error) {
    console.log("Error while fetching subscribed channels", error);
    throw new apiError(
      400,
      "Something went wrong while fetching subscribed channels"
    );
  }
});

export { toogleSubscription, getUserChannelSubscribers, getSubscribedChannels };
