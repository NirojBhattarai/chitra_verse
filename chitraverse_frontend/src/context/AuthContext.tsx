import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { IuserDataResponse } from "../interfaces/interface";
import { fetchAuthenticatedUser, refreshAccessToken } from "../api/auth";

const AuthContext = createContext<{
  user: IuserDataResponse | null;
  login: (userData: IuserDataResponse) => void;
  logout: () => void;
  loading: boolean;
  fetchUser: () => void;
}>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  fetchUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IuserDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (userData: IuserDataResponse) => {
    setUser(userData);
    setLoading(false); 
  };

  
  const logout = () => {
    setUser(null);
    setLoading(false);
  };

 
  const fetchUser = async () => {
    setLoading(true); 
    try {
      const response = await fetchAuthenticatedUser();
      setUser(response.data);
    } catch (error) {
      console.error("Authentication error:", error);
      try {
        await refreshAccessToken();
        const response = await fetchAuthenticatedUser();
        setUser(response.data);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        logout(); 
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, fetchUser }}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
