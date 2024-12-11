import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import {apiResponse} from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // User validation
    if (
        [fullname, email, username, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required");
    }

   const existedUser = await User.findOne({
        $or: [{fullname},{email}]
    })

    if(existedUser){
        throw new apiError(409,"User with email or username already exists");
    }

    //File Upload 
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath || !coverLocalPath){
        throw new apiError(400, "Avatar or Cover Image is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    // Creating user 
    const user = await User.create({
        fullname,
        username : username.toLowerCase(),
        avatar: avatar.url,
        coverImage : coverImage.url,
        email,
        password
    })

   const createdUser = await User.findById(user._id).select("-password -refreshToken");

   if(!createdUser){
     throw new apiError(400, "Something went wrong while registering user");
   }

   return res
        .status(202)
        .json(new apiResponse(200, createdUser, "User Registered Successfully"))
});

export { registerUser };
