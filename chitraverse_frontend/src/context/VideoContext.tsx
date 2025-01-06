import { createContext, useContext, useState, ReactNode } from "react";
import { fetchVideos as fetchVideosApi } from "../api/video";
import { IVideo } from "../interfaces/interface";

const VideoContext = createContext<{
  videos: IVideo[] | null;
  loading: boolean;
  fetchVideos: () => void;
}>({
  videos: null,
  loading: true,
  fetchVideos: () => {},
});

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetchVideosApi();
      setVideos(response); 
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoContext.Provider value={{ videos, loading, fetchVideos }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
