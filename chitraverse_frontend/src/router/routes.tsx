import { createBrowserRouter, RouteObject } from "react-router";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

export const routes: RouteObject[] = [
    {
        path:"/",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    }
]

const router = createBrowserRouter(routes);

export default router;