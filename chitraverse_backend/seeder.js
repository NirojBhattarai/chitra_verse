import mongoose from "mongoose";
import {Video} from "./src/models/video.models.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

const seedVideos = async () => {
  const videos = [
    {
      videoFile: "video1.mp4",
      thumbnail: "thumb1.jpg",
      title: "Sample Video 1",
      description: "This is a sample video description.",
      duration: 120,
      isPublished: true,
      owner: "6763c92827d1fc1a4a33b555", // Replace with a valid User ID from your database
    },
    {
      videoFile: "video2.mp4",
      thumbnail: "thumb2.jpg",
      title: "Sample Video 2",
      description: "Another video description.",
      duration: 90,
      isPublished: true,
      owner: "6763c92827d1fc1a4a33b555",
    },
  ];

  await Video.insertMany(videos);
  console.log("Videos seeded successfully!");
  process.exit();
};

seedVideos();
