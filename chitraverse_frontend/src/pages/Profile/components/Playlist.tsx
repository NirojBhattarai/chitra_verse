import { usePlaylist } from "../../../context/PlaylistContext";
import { useAuth } from "../../../context/AuthContext";
import { useEffect } from "react";

const Playlist = () => {
  const { playlists, fetchPlaylists, loading } = usePlaylist();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && !authLoading) {
      fetchPlaylists();
    }
  }, [user]);

  if (authLoading || loading) {
    return <div>Loading...</div>; 
  }

  if (!playlists || playlists.length === 0) {
    return <div>No playlists found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Playlists</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-40 bg-gray-200">
              <img
                src={user?.coverImage}
                alt={playlist.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {playlist.name}
              </h2>
              <p className="text-sm text-gray-600">{playlist.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
