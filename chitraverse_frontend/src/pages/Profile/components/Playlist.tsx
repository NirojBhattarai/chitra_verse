const Playlist = () => {
    const playlists = [
      {
        id: 1,
        name: "Relaxing Music",
        cover: "https://via.placeholder.com/150",
        itemCount: 24,
      },
      {
        id: 2,
        name: "Workout Hits",
        cover: "https://via.placeholder.com/150",
        itemCount: 30,
      },
      {
        id: 3,
        name: "Coding Tunes",
        cover: "https://via.placeholder.com/150",
        itemCount: 15,
      },
      {
        id: 4,
        name: "Top Hits 2023",
        cover: "https://via.placeholder.com/150",
        itemCount: 40,
      },
    ];
  
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Playlists</h1>
  
        {/* Grid for Playlists */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Playlist Cover */}
              <div className="h-40 bg-gray-200">
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              </div>
  
              {/* Playlist Details */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {playlist.name}
                </h2>
                <p className="text-gray-600">{playlist.itemCount} items</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Playlist;
  