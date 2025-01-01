import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { Subscription } from "../models/subscription.models.js";

const toogleSubscription = asyncHandler(async (req, res) => {
  const { id: channelId } = req.params;

  if (!channelId) {
    throw new apiError(400, "Channeld is missing or Invalid");
  }

  const  userId  = req.user._id;

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

export {toogleSubscription}