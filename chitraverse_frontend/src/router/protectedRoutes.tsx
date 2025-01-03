import { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const ProtectedRoutes:React.FC<{children:ReactNode}> = ({children}) => {
    const {user} = useAuth();

 if(user){
   return <>{children}</>;
 }

 return <Navigate to="/" replace />;
}

export default ProtectedRoutes