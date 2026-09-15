import { createContext, useState, useEffect, useContext } from "react";
import { apiFetch } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const data = await apiFetch("auth/me");
      setUser(data?.user || null);
      setIsAuthenticated(data?.user ? true : false);
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (loginPayload) => {
    try {
      const data = await apiFetch("auth/login", {
        method: "POST",
        body: loginPayload,
      });

      if (data) {
        setUser(data?.user); // Or run await checkSession() if login doesn't return user info
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.data.error || "Server error",
        status: error.stauts,
      };
    }
  };

  const logout = async () => {
    try {
      await apiFetch("auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null); // Clear local state regardless of server response
    }
  };

  const register = async (registerPayload) => {
    try {
      const data = await apiFetch("auth/register", {
        method: "POST",
        body: registerPayload,
      });
      return { success: true, message: data?.message };
    } catch (error) {
      return {
        success: false,
        message: error.data.error || "Server error",
        status: error.stauts,
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

//in our AuthContext.jsx there is a component called AuthProvider
