import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError(404, "User not Found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new apiError(500, "Error Generating Access and Refresh Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // User validation
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new apiError(400, "Invalid email format");
  }

  // Password strength validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*[\d\W])[A-Za-z\d\W]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new apiError(
      400,
      "Password must be at least 8 characters long and contain both letters and numbers"
    );
  }

  const existedUser = await User.findOne({
    $or: [{ fullname }, { email }, { username }],
  });

  if (existedUser) {
    throw new apiError(
      400,
      "User with the provided fullname, email, or username already exists"
    );
  }

  //File Upload
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath || !coverLocalPath) {
    throw new apiError(400, "Avatar or Cover Image is missing");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded successfully", avatar);
  } catch (error) {
    console.log("Error Uploading Avatar", error);
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath);
    console.log("Cover Image uploaded successfully", coverImage);
  } catch (error) {
    console.log("Error Uploading Cover Image", error);
  }

  // Creating user
  try {
    const user = await User.create({
      fullname,
      username: username.toLowerCase(),
      avatar: avatar.url,
      coverImage: coverImage.url,
      email,
      password,
    });

    await user.save();

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    await user.save();

    if (!createdUser) {
      throw new apiError(400, "Something went wrong while registering user");
    }

    return res
      .status(202)
      .json(new apiResponse(200, createdUser, "User Registered Successfully"));
  } catch (error) {
    console.log("User Creation Failed");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }

    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }
    throw new apiError(
      400,
      "Something went wrong while registering user and images were deleted"
    );
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // User Validation
  if (!email || !password) {
    throw new apiError(404, "Email and password are required");
  }

  const user = await User.findOne({
    $or: [{ email }],
  });

  if (!user) {
    throw new apiError(404, "User not Found");
  }

  // Validate Password

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new apiError(400, "Invalid Credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new apiError(404, "Logged in user not found");
  }

  const options = {
    httpOnly: true,
    secure: (process.env.NODE_ENV = "production"),
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        { user: loggedInUser, accessToken, refreshToken },
        "User Loggedin Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, "User logout successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Refresh Token is Required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new apiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError();
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: (process.env.NODE_ENV = "production"),
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while accessing refresh token"
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new apiError(404, "User not Found");
  }

  const isPasswordValid = user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new apiError(401, "Incorrect old password");
  }

  user.password = newPassword;

  user.save({
    validateBeforeSave: false,
  });

  return res
    .status(200)
    .json(new apiResponse(200, "Password Changed Successfully"));
});

const getUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        req.user,
        "Current User Details Fetched Successfully"
      )
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  // validate required field
  if ([fullname, email].some((field) => field?.trim() === "")) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "User Details Updated Successfully"));
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  console.log(avatarLocalPath);

  if (!avatarLocalPath) {
    throw new apiError(404, " Avatar Image is missing");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("Avatar uploaded successfully", avatar);
  } catch (error) {
    console.log("Error Uploading Avatar", error);
  }

  if (!avatar.url) {
    throw new apiError(400, "Something went wrong while updating avatar image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar is updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!coverImageLocalPath) {
    throw new apiError(404, "Cover Image is missing");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("Cover Image uploaded successfully", coverImage);
  } catch (error) {
    console.log("Error Uploading Cover Image", error);
  }

  if (!coverImage.url) {
    throw new apiError(400, "Something went wrong while uploading Cover Image");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover Image is updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const username = req.params;

  if (!username) {
    throw new apiError(400, "User is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullname: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 10,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(404, "Channel not found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "Channel Profile Fetched Successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullname: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  if (!user.length) {
    throw new apiError(
      400,
      user[0]?.watchHistory,
      "Watch History Fetched Successfully"
    );
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new apiError(404, "User not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set reset token and expiration
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // Construct reset URL
  const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Send email
  try {
    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL}>`,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click on the following link to reset your password: ${resetURL}. This link is valid for 1 hour.`,
    });

    res.status(200).json(new apiResponse(200, "Email sent successfully"));
  } catch (error) {
    console.error("Error sending email:", error.message);

    // Reset token and expiration in case of error
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new apiError(500, "Email could not be sent");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    throw new apiError(400, "Password is required");
  }

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new apiError(400, "Invalid or expired token");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json(new apiResponse(200, "Password reset successfully"));
});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  changeCurrentPassword,
  getUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  forgotPassword,
  resetPassword,
};
