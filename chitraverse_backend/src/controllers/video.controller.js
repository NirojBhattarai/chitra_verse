import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getVideoDuration } from "../middlewares/fluent-ffmpeg.middlewares.js";

//Endpoint to fetch videos
const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query = "",
    sortBy = "createdAt",
    sortType = "desc",
    userId = req.user._id,
  } = req.query;

  const pageNumber = parseInt(page, 10);
  const pageSize = parseInt(limit, 10);
  const sortOrder = sortType.toLowerCase() === "asc" ? 1 : -1;

  // Function to filter videos while fetching
  const filter = {
    isPublished: true,
    ...(userId && { owner: userId }),
    ...(query && {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }),
  };

  try {
    // Query the Database with filters, sorting and pagination
    const videos = await Video.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    if (!videos.length) {
      throw new apiError(404, "Videos Not Found");
    }

    const totalVideos = await Video.countDocuments(filter);

    // Retun Response with metadata
    return res.status(200).json({
      meta: {
        total: totalVideos,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalVideos / pageSize),
        pageSize,
      },
      response: new apiResponse(200, videos, "Videos fetched successfully"),
    });
  } catch {
    throw new apiError(400, "Error while fetching videos");
  }
});

//Endpoint to upload videos
const publishVideos = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // Check title and description in request body
  if (!title || !description) {
    throw new apiError(400, "All fields are required");
  }

  // Check Video File and Thumbnail in request
  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0].path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new apiError(400, "Video File or Thumbnail is missing");
  }

  const duration = await getVideoDuration(videoFileLocalPath);

  // Uploading VideoFile and Thumbnail in Cloudinary
  let videoFile;

  try {
    videoFile = await uploadOnCloudinary(videoFileLocalPath);
    console.log("Video Uploaded Successfully");
  } catch {
    throw new apiError(400, "Error Uploading Video in CLoudinary");
  }

  let thumbnail;

  try {
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log("Thumbnail Uploaded Successfully");
  } catch {
    throw new apiError(400, "Error Uploading Thumbnail in Cloudinary");
  }

  if (!duration) {
    throw new apiError(400, "Error generating duration of Video File");
  }

  // Creating New Video Record
  try {
    const video = await Video.create({
      videoFile: videoFile.url,
      thumbnail: thumbnail.url,
      title,
      description,
      duration: duration / 60,
      isPublished: true,
      owner: req.user._id,
    });

    if (!video) {
      throw new apiError(400, "Error Creating Video File");
    }

    return res
      .status(200)
      .json(new apiResponse(200, video, "Vide File Uploaded Successfully"));
  } catch (error) {
    console.log("Error Creating Video Record", error);
    throw new apiError(400, "Something went wrong while uploading video");
  }
});

//Endpoint to fetch individual videos
const getVideoById = asyncHandler(async (req, res) => {
  const { id: _id } = req.params;

  if (!_id) {
    throw new apiError(400, "Invalid Video Id or Video Id is missing");
  }

  try {
    const video = await Video.findById(_id);

    if (!video) {
      throw new apiError(404, "Find Not Found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, video, "Video fetched successfully"));
  } catch (error) {
    console.log(400, "Error Fetching Video", error);
    throw new apiError(400, "Error Fetching Video");
  }
});

//Endpoint to update video details
const updateVideo = asyncHandler(async (req, res) => {
  const { id: _id } = req.params;

  if (!_id) {
    throw new apiError(400, "Video Id is invalid or missing");
  }

  const { title, description } = req.body;

  if (!title || !description) {
    throw new apiError(400, "All Fields are Required");
  }

  try {
    const video = await Video.findByIdAndUpdate(
      _id,
      {
        title,
        description,
      },
      {
        new: true,
      }
    );

    if (!video) {
      throw new apiError(404, "Error While Updating Video Details");
    }

    await video.save();

    return res
      .status(200)
      .json(new apiResponse(200, video, "Video Details Updated Successfully"));
  } catch (error) {
    console.log("Error while Updating Video Details", error);
    throw new apiError(400, "Error While Updating Video Details");
  }
});


//Endpoint to delete video
const deleteVideo = asyncHandler(async ( req, res)=>{
  const {id : _id} = req.params;
  
  if(!_id){
    throw new apiError(400,"Invalid Video Id or Missing");
  }

  try {
    const video = await Video.findByIdAndDelete(_id);

    if(!video){
      throw new apiError(400,"Video not Found or already deleted");
    }

    return res
    .status(200)
    .json(new apiResponse(200,"Video Deleted Successfully"));

  } catch (error) {
    console.log("Error while deleting video",error);
    throw new apiError(400, "Error while deleting video");
  }
});

export { getAllVideos, publishVideos, getVideoById, updateVideo, deleteVideo };
