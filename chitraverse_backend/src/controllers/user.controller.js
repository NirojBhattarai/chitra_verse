import { asyncHandler } from "../utils/asyncHandler";
import apiError from "../utils/apiError";
import { User } from "../models/user.models";
import {uploadOnCloudinary} from "../utils/cloudinary"

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

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath || !coverLocalPath){
        throw new apiError(400, "Avatar or Cover Image is missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);
});

export { registerUser };
