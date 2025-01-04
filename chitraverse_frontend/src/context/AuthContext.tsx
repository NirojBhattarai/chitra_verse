import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { IuserDataResponse } from "../interfaces/interface";
import { fetchAuthenticatedUser, refreshAccessToken } from "../api/auth";

const AuthContext = createContext<{
  user: IuserDataResponse | null;
  login: (userData: IuserDataResponse) => void;
  logout: () => void;
}>( {
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IuserDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const login = (userData: IuserDataResponse) => setUser(userData);

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
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

    initializeAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loader here if needed
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);