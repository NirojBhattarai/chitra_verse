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
       const response = await cloudinary.uploader.upload(
            localFilePath, {
                resource_type: 'auto'
            }
        )
        console.log("File Uploaded on Cloudinary. File Source:" + response.url);
        // Removig file from local server after uploading on cloud platform
        fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null
    }
}

export {uploadOnCloudinary}