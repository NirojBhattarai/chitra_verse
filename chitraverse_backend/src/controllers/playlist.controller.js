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

const getUserPlaylist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new apiError(400, "User Invalid or Unauthorized Request");
  }
  try {
    const userplaylist = await Playlist.find({ owner: userId });

    if (!userplaylist) {
      throw new apiError(400, "Error while fetching playlist");
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, userplaylist, "User Playlist Fetched Successfully")
      );
  } catch (error) {
    console.log("Error while fetching user playlist", error);
    throw new apiError(400, "Something went wrong while fetching playlist");
  }
});

const getPlaylistById = asyncHandler(async(req, res) =>{
  const playlistId = req.params;

  if(!playlistId){
    throw new apiError(400, "Invalid or Missing PlaylistId");
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
      throw new apiError(400, "Error while fetching playlist by id");
    }

    return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist Fetched Successfully by Id"));
  } catch (error) {
    console.log("Error while fetching Playlist By Id");
    throw new apiError(400, "Something went wrong while fetching Playlist");
  }
});

export { createPlaylist, getUserPlaylist, getPlaylistById };
