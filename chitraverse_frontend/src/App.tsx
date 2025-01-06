import { RouterProvider } from "react-router";
import router from "./router/routes";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext";
import { PlaylistProvider } from "./context/PlaylistContext";
function App() {
  return (
    <>
      <AuthProvider>
        <VideoProvider>
          <PlaylistProvider>
        <RouterProvider router={router} />
        </PlaylistProvider>
        </VideoProvider>
      </AuthProvider>
      
    </>
  );
}

export default App;
