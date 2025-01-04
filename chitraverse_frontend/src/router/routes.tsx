import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardLayout from "../layout/DashboardLayout";
import Home from "../pages/Home/Home";

export const routes: RouteObject[] = [
  {
    path:"/login",
    element: <Login/>
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    element: (
        <DashboardLayout />
    ),
    children:[
        {
            path:'/',
            element:<Home/>
        }
    ]
  },
];

const router = createBrowserRouter(routes);

export default router;
