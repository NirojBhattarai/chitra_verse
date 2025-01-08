import { RouterProvider } from "react-router";
import router from "./router/routes";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext";
import { PlaylistProvider } from "./context/PlaylistContext";
import { LikedVideosProvider } from "./context/LikeContext";
function App() {
  return (
    <>
      <AuthProvider>
        <VideoProvider>
          <PlaylistProvider>
            <LikedVideosProvider>
              <RouterProvider router={router} />
            </LikedVideosProvider>
          </PlaylistProvider>
        </VideoProvider>
      </AuthProvider>
    </>
  );
}

export default App;
