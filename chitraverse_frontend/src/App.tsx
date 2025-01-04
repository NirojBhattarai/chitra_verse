import { RouterProvider } from "react-router";
import router from "./router/routes";
import { AuthProvider } from "./context/AuthContext";
import { VideoProvider } from "./context/VideoContext";
function App() {
  return (
    <>
      <AuthProvider>
        <VideoProvider>
        <RouterProvider router={router} />
        </VideoProvider>
      </AuthProvider>
      
    </>
  );
}

export default App;
