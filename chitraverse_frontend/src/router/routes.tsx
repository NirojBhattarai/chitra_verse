import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";
import ProtectedRoutes from "./protectedRoutes";

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
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
