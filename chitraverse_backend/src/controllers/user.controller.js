import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
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

  const existedUser = await User.findOne({
    $or: [{ fullname }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
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
      $set: { refreshToken: undefined },
    },
    {
      new: true, 
    }
  );

  const options = {
    httpOnly:true,
    secure : process.env.NODE_ENV === "production"
  }

  return res 
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new apiResponse(200,"User logout successfully"))
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

const changeCurrentPassword = asyncHandler(async(req, res)=>{
  const {oldPassword, newPassword} = req.body;

  const user = await User.findById(req.user?._id);

  if(!user){
    throw new apiError(404, "User not Found");
  }

  const isPasswordValid = user.isPasswordCorrect(oldPassword);

  if(!isPasswordValid){
    throw new apiError(401,"Incorrect old password");
  }

  user.password = newPassword;

  user.save({
    validateBeforeSave:false
  });

  return res
  .status(200)
  .json(new apiResponse(200,"Password Changed Successfully"));

});

const getUser = asyncHandler(async(req, res)=>{
  return res
  .status(200)
  .json(new apiResponse(200,req.user, "Current User Details Fetched Successfully"))
});

const updateAccountDetails = asyncHandler(async(req,res)=>{
  const {fullname, email} = req.body;

  // validate required field
  if (
    [fullname, email].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(req.user?._id,{
    $set:{
      fullname,
      email
    }
  },
{
  new:true
}).select("-password -refreshToken"); 

return res
.status(200)
.json(new apiResponse(200,user,"User Details Updated Successfully"));

})

export { 
  registerUser, 
  loginUser, 
  refreshAccessToken, 
  logoutUser, 
  changeCurrentPassword, 
  getUser,
  updateAccountDetails
};
