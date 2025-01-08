import { createContext, useContext, ReactNode, useState } from "react";
import { fetchLikedVideos as fetchLikedVideosApi } from "../api/like";
import { ILikedVideos } from "../interfaces/interface";

const LikedVideosContext = createContext<{
  likedvideos: ILikedVideos[] | null;
  loading: boolean;
  fetchLikedVideos: () => void;
}>({
  likedvideos: null,
  loading: true,
  fetchLikedVideos: () => {},
});

export const LikedVideosProvider = ({ children }: { children: ReactNode }) => {
  const [likedvideos, setLikedVideos] = useState<ILikedVideos[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLikedVideos = async () => {
    setLoading(true);
    try {
      const response = await fetchLikedVideosApi();
      setLikedVideos(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <LikedVideosContext.Provider value={{ likedvideos, fetchLikedVideos, loading }}>
      {children}
    </LikedVideosContext.Provider>
  );
};

export const useLike = () => useContext(LikedVideosContext);
