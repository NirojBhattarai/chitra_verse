import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useVideo } from "../../context/VideoContext";

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const { videos, loading, fetchVideos } = useVideo();
  
  useEffect(() => {
    if (user) {
      fetchVideos();
    }
  }, [user]);

  if (authLoading || loading || !videos) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {Array.isArray(videos) && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer transform hover:scale-95"
            >
              <div className="relative group">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-36 object-cover group-hover:opacity-75 transition-opacity duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded">
                  {Math.floor(video.duration)}:
                  {Math.floor(video.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center mb-1">
                  <img
                    src={user?.avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="text-sm text-gray-600">
                    {user?.fullname || "Anonymous"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {video.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {video.views} views
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No videos available</p>
      )}
    </div>
  );
};

export default Home;
