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

const getPlaylistById = asyncHandler(async (req, res) => {
  const playlistId = req.params;

  if (!playlistId) {
    throw new apiError(400, "Invalid or Missing PlaylistId");
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      throw new apiError(400, "Error while fetching playlist by id");
    }

    return res
      .status(200)
      .json(
        new apiResponse(200, playlist, "Playlist Fetched Successfully by Id")
      );
  } catch (error) {
    console.log("Error while fetching Playlist By Id");
    throw new apiError(400, "Something went wrong while fetching Playlist");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { id: playlistId } = req.params;

  if (!playlistId) {
    throw new apiError(400, "Invalid or Missing PlaylistId");
  }

  const { videoId } = req.body;

  if (!videoId) {
    throw new apiError(400, "Invalid or Missing VideoId");
  }

  try {
    const isVideoInPlaylist = await Playlist.findOne({
      _id: playlistId,
      videos: { $in: [videoId] },
    });

    if (isVideoInPlaylist) {
      return res
        .status(400)
        .json(
          new apiError(
            400,
            isVideoInPlaylist,
            "Video already exists in the playlist"
          )
        );
    } else {
      const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
          $push: {
            videos: videoId,
          },
        },
        {
          new: true,
        }
      );

      if (!playlist) {
        throw new apiError(400, "Error while adding video to the playlist");
      }

      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            playlist,
            "Video added to the playlist successfully"
          )
        );
    }
  } catch (error) {
    console.log("Error while adding video to the playlist");
    throw new apiError(
      400,
      " Something went wrong while adding video to the playlist"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  if (!playlistId) {
    throw new apiError(400, "Invalid or Missing PlaylistId");
  }

  const { videoId } = req.body;

  if (!videoId) {
    throw new apiError(400, "Invalid or Missing VideoId");
  }

  const isVideoInPlaylist = await Playlist.findOne({
    _id: playlistId,
    videos: { $in: [videoId] },
  });

  if (!isVideoInPlaylist) {
    return res
      .status(400)
      .json(
        new apiError(
          400,
          isVideoInPlaylist,
          "Video does not exists in the playlist"
        )
      );
  } else {
    try {
      const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
          $pull: {
            videos: videoId,
          },
        },
        {
          new: true,
        }
      );

      if (!playlist) {
        throw new apiError(400, "Error while removing video from the playlist");
      }

      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            playlist,
            "Video removed from the playlist successfully"
          )
        );
    } catch (error) {
      console.log("Error while removing video from the playlist");
      throw new apiError(
        400,
        " Something went wrong while removing video from the playlist"
      );
    }
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { id: _id } = req.params;

  if (!_id) {
    throw new apiError(400, "Playlist Id is Invalid or Missing");
  }

  try {
    const playlist = await Playlist.findByIdAndDelete(_id);

    if (!playlist) {
      return res
        .status(400)
        .json(new apiError(400, null, "Playlist not found or already deleted"));
    }

    return res
      .status(200)
      .json(new apiResponse(200, null, "Playlist Deleted Successfully"));
  } catch (error) {
    console.log("Error while deleting playlist");
    throw new apiError(400, "Something went wrong while deleting playlist");
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new apiError(400, "Name or Description is missing");
  }

  const { id: _id } = req.params;

  if (!_id) {
    throw new apiError(400, "Invalid or Missing Playlist Id");
  }

  try {
    const playlist = await Playlist.findByIdAndUpdate(
      _id,
      {
        name: name,
        description: description,
      },
      {
        new: true,
      }
    );
 
    if (!playlist) {
      return res
        .status(400)
        .json(new apiError(400, null, "Failed Updating Playlist"));
    }

    return res
      .status(200)
      .json(new apiResponse(200, playlist, "Playlist Updated Successfully"));
  } catch (error) {
    console.log("Error while updating playlist");
    throw new apiError(400, "Something went wrong while updating playlist");
  }
});

export {
  createPlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
