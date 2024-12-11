import { asyncHandler } from "../utils/asyncHandler";
import apiError from "../utils/apiError";
import { User } from "../models/user.models";

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
});

export { registerUser };
