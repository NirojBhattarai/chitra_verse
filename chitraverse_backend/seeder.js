import mongoose from "mongoose";
import {Comment} from "./src/models/comment.models.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.mongoDB_URI);

const seedVideos = async () => {
  const commments = [
    {
      content:"Very nice video",
      video:"676d5821425b438d3a6ead34",
      owner:"6763c92827d1fc1a4a33b555"
    }
  ];

  await Comment.insertMany(commments);
  console.log("Videos seeded successfully!");
  process.exit();
};

seedVideos();
