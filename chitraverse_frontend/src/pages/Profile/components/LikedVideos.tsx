import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLike } from "../../../context/LikeContext"; 
import { fetchVideosById } from "../../../api/video"; 

const LikedVideos = () => {
  const { likedvideos, fetchLikedVideos, loading } = useLike(); 
  const { user, loading: authLoading } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchLikedVideos(); 
      console.log(likedvideos)
    }
  }, [user]);

  useEffect(() => {
    const fetchVideos = async () => {
      if (likedvideos && likedvideos.length > 0) {
        const videoDetails = await Promise.all( 
          likedvideos.map(async (likedVideo) => {
            const response = await fetchVideosById(likedVideo.videos);
            return response;
          })
        );
        setVideos(videoDetails);
        console.log(videoDetails);
      }
    };

    fetchVideos();
  }, [likedvideos]);

  if (authLoading || loading) {
    return <div>Loading...</div>;
  }

  if (!videos || videos.length === 0) {
    return <div>No liked videos found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Liked Videos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-40 bg-gray-200">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {video.title}
              </h2>
              <p className="text-sm text-gray-600">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LikedVideos;