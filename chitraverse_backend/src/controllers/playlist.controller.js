import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Playlist } from "../models/playlist.models.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new apiError(400, "User Id is invalid or missing");
  }

  const { name, description } = req.body;

  if (!name || !description) {
    throw new apiError(400, "Name or description missing");
  }

  try {
    const playlist = await Playlist.create({
      name: name,
      description: description,
      owner: userId,
    });

    if (!playlist) {
      throw new apiError(400, "Error creating playlist");
    }

    return res
      .status(200)
      .json(new apiResponse(201, playlist, "Playlist created successfully"));
  } catch (error) {
    console.log("Error while creating playlist", error);
    throw new apiError(400, "Something went wrong while creating playlist");
  }
});

export { createPlaylist };
