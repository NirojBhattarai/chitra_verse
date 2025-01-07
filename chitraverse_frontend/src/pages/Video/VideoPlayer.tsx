import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useVideo } from "../../context/VideoContext";
import { IVideo } from "../../interfaces/interface";

const VideoPlayer = () => {
  const { id } = useParams<{ id: string }>();
  const { videos, fetchVideosById, loading } = useVideo();
  const [currentVideo, setCurrentVideo] = useState<IVideo | null>(null);

  useEffect(() => {
    if (id) {
      if (!videos) {
        // Fetch the video by ID if videos are not already loaded
        fetchVideosById(id);
      } else {
        const video = videos.find((video) => video._id === id);
        setCurrentVideo(video || null);
      }
    }
  }, [id, videos, fetchVideosById]);

  if (loading) {
    return <div className="text-center py-8">Loading video...</div>;
  }

  if (!currentVideo) {
    return <div className="text-center py-8">Video not found!</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Video Player Section */}
        <div className="flex-1">
          <div>
            <video
              width="100%"
              height="auto"
              controls
              className="w-full h-auto rounded-lg shadow-lg"
            >
              <source src={currentVideo.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h1 className="text-2xl font-bold mt-4">{currentVideo.title}</h1>
            <p className="text-gray-600 mt-2">{currentVideo.description}</p>
          </div>

          {/* Comment Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <p>No comments yet. Be the first to comment!</p>
            </div>
          </div>
        </div>

        {/* Recommended Videos Section */}
        <div className="w-full lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
          <div className="flex flex-col gap-4">
            {videos &&
              videos
                .filter((video) => video._id !== id)
                .map((video) => (
                  <div key={video._id} className="flex items-center gap-4">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{video.title}</h3>
                      <p className="text-sm text-gray-600">
                        {video.views} views
                      </p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
