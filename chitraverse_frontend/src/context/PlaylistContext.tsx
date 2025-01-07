import { createContext, useContext, useState, ReactNode} from "react";
import { fetchPlaylists as fetchPlaylistsApi } from "../api/playlist";
import { IPlaylist } from "../interfaces/interface";

const PlaylistContext = createContext<{
  playlists: IPlaylist[] | null;
  loading: boolean;
  fetchPlaylists: () => void;
}>({
  playlists: null,
  loading: true,
  fetchPlaylists: () => {},
});

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlists, setPlaylists] = useState<IPlaylist[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const response = await fetchPlaylistsApi();
      setPlaylists(response); 
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PlaylistContext.Provider value={{ playlists, loading, fetchPlaylists }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
