const WatchHistory = () => {
    const history = [
      {
        id: 1,
        title: "How to Learn React in 2023",
        thumbnail: "https://via.placeholder.com/150",
        duration: "12:34",
        watchedAt: "2024-12-30 14:20",
      },
      {
        id: 2,
        title: "Top 10 JavaScript Tips",
        thumbnail: "https://via.placeholder.com/150",
        duration: "08:15",
        watchedAt: "2024-12-29 18:45",
      },
      {
        id: 3,
        title: "Understanding Async/Await",
        thumbnail: "https://via.placeholder.com/150",
        duration: "16:48",
        watchedAt: "2024-12-28 10:30",
      },
    ];
  
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Watch History</h1>
  
        {/* Video List */}
        <div className="space-y-6">
          {history.map((video) => (
            <div
              key={video.id}
              className="flex items-start bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Thumbnail */}
              <div className="w-1/4 h-24 bg-gray-200">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
              </div>
  
              {/* Video Details */}
              <div className="flex-1 p-4">
                <h2 className="text-lg font-bold text-gray-800 truncate">
                  {video.title}
                </h2>
                <p className="text-gray-600 text-sm">Duration: {video.duration}</p>
                <p className="text-gray-600 text-sm">
                  Watched on: {new Date(video.watchedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default WatchHistory;
  