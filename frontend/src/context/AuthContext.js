import { createContext, useContext, useEffect, useMemo, useState } from "react";
import client from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || ""
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("accessToken", accessToken || "");
    localStorage.setItem("refreshToken", refreshToken || "");

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [accessToken, refreshToken, user]);

  useEffect(() => {
    async function loadUser() {
      if (!accessToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const response = await client.get("/users/me/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        logout();
      } finally {
        setAuthLoading(false);
      }
    }

    loadUser();
  }, [accessToken]);

  const login = async (email, password) => {
    const response = await client.post("/auth/login/", {
      email,
      password,
    });

    const { access, refresh, user } = response.data;

    setAccessToken(access);
    setRefreshToken(refresh);

    if (user) {
      setUser(user);
    } else {
      const meResponse = await client.get("/users/me/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setUser(meResponse.data);
    }

    return response.data;
  };

  const register = async (formData) => {
    const response = await client.post("/users/register/", formData);
    return response.data;
  };

  const logout = () => {
    setAccessToken("");
    setRefreshToken("");
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const isAuthenticated = !!accessToken;
  const isAdmin = !!user?.is_staff || !!user?.is_superuser;

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      authLoading,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
    }),
    [accessToken, refreshToken, user, authLoading, isAuthenticated, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}