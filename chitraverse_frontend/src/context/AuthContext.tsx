import { createContext, useContext, useState } from "react";
import { IuserDataResponse } from "../interfaces/interface";


const AuthContext = createContext<{
  user: IuserDataResponse | null,
  login: (userData: IuserDataResponse) => void,
  logout: () => void
}>({
  user: null,
  login: () => {},
  logout: () => {}
});

import { ReactNode } from "react";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IuserDataResponse | null>(null);

  const login = (userData:IuserDataResponse) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
