import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoutes from "./protectedRoutes";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";

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
    children:[
        {
            path:'/dashboard',
            element:<Dashboard/>
        }
    ]
  },
];

const router = createBrowserRouter(routes);

export default router;
