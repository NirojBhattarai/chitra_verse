import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

// Cloudinary Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload localFile on Cloudinary
const uploadOnCloudinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        cloudinary.uploader.upload(
            localFilePath, {
                resource_type: 'auto'
            }
        )
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary}