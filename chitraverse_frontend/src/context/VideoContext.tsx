import { createContext, useContext, useState, ReactNode } from "react";
import { fetchVideos as fetchVideosApi } from "../api/video";
import { fetchVideosById as fetchVideosApiById } from "../api/video";
import { IVideo } from "../interfaces/interface";

const VideoContext = createContext<{
  videos: IVideo[] | null;
  loading: boolean;
  fetchVideos: () => void;
  fetchVideosById: (_id: string) => void;
}>({
  videos: null,
  loading: true,
  fetchVideos: () => {},
  fetchVideosById: () => {},
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

  const fetchVideosById = async (_id: string) => {
    setLoading(true);
    try {
      const response = await fetchVideosApiById(_id);
      setVideos(response); 
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VideoContext.Provider value={{ videos, loading, fetchVideos, fetchVideosById }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);
