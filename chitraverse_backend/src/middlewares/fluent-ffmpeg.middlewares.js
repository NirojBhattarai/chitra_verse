import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';  // Static path for ffmpeg executable
import ffprobeStatic from 'ffprobe-static';  // Static path for ffprobe executable

// Set the paths for ffmpeg and ffprobe
ffmpeg.setFfmpegPath(ffmpegStatic);
ffmpeg.setFfprobePath(ffprobeStatic.path);

const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .ffprobe((err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const duration = metadata.format.duration; // Duration in seconds
          resolve(duration);
        }
      });
  });
};

export { getVideoDuration };
