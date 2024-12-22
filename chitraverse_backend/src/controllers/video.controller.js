import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";

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

const publishVideos = asyncHandler(async(req, res) => {
})

export { getAllVideos };
