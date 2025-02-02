import {User} from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, _, next)=>{
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        throw new apiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if(!user){
            throw new apiError(401, "Unauthorized");
        }

        req.user = user;

        next();

    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Access Token");
    }
})