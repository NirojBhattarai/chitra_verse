import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchVideos } from "../api/auth"; 
import { IVideo } from "../interfaces/interface";

const VideoContext = createContext<{
  videos: IVideo[] | null;
  addVideo: (videoData: IVideo) => void;
  removeVideo: (videoId: string) => void;
}>({
  videos: null,
  addVideo: () => {},
  removeVideo: () => {},
});

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const addVideo = (videoData: IVideo) => {
    setVideos((prevVideos) => (prevVideos ? [...prevVideos, videoData] : [videoData]));
  };

  const removeVideo = (videoId: string) => {
    setVideos((prevVideos) => prevVideos?.filter((video) => video._id !== videoId) || null);
  };

  useEffect(() => {
    const initializeVideos = async () => {
      try {
        const fetchedVideos = await fetchVideos();
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeVideos();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <VideoContext.Provider value={{ videos, addVideo, removeVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);