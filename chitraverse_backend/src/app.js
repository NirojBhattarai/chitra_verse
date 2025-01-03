import express, { urlencoded } from 'express';
import cors from 'cors';
import healthcheckRouter from './routes/healthcheck.routes.js';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import likeRouter from './routes/like.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const corsOptions = {
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "*",
      ];
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 200, // For legacy browser support
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });

//middlewares
app.use(express.json({limit:"16kb"}));
app.use(urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//Routes
app.use("/api/v1/healthcheck",healthcheckRouter);
app.use("/api/v1/users",userRouter);
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/tweets",tweetRouter);
app.use("/api/v1/likes",likeRouter);
app.use("/api/v1/playlists",playlistRouter);
app.use("/api/v1/subscriptions",subscriptionRouter);
app.use("/api/v1/dashboard", dashboardRouter);

export {app};