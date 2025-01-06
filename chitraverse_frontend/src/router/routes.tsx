import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";
import Profile from "../pages/Profile/Profile"
import ProtectedRoutes from "./protectedRoutes";
import Playlist from "../pages/Profile/components/Playlist";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: (
      <ProtectedRoutes>
        <DashboardLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"/playlist",
        element:<Playlist/>
      }
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
