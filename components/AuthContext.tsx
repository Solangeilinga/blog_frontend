"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { authApi, type ApiUser } from "@/lib/api";

interface AuthContextType {
  user:       ApiUser | null;
  isLoggedIn: boolean;
  isLoading:  boolean;
  login:      (email: string, password: string) => Promise<void>;
  register:   (username: string, email: string, password: string, role?: string) => Promise<void>;
  logout:     () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, isLoggedIn: false, isLoading: true,
  login: async () => {}, register: async () => {}, logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,      setUser]      = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérification de session au montage (cookie httpOnly)
  useEffect(() => {
    authApi.me()
      .then(({ user }) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await authApi.login({ email, password });
    setUser(user);
  }, []);

  const register = useCallback(async (
    username: string, email: string, password: string, role?: string
  ) => {
    await authApi.register({ username, email, password, role });
    // Auto-login après inscription
    const { user } = await authApi.login({ email, password });
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, isLoading, login, register, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
