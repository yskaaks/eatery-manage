import React, { createContext, useState, useCallback } from "react";
import axios from "axios";
import { AuthContextType, Props, User } from "../interface";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const checkToken = localStorage.getItem("token");
  const [token, setToken] = useState<string | null>(
    checkToken ? checkToken : null
  );
  const [user, setUser] = useState<User | null>(null);
  const api = axios.create({
    baseURL: "http://127.0.0.1:5000",
  });

  const login = useCallback(
    async (email: string, password: string, role: string) => {
      try {
        const response = await api.post("/api/auth/login", {
          email,
          password,
          role,
        });
        const { token, role: userRole, id } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("id", id);
        setToken(token);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    []
  );

  const googleLogin = useCallback(async (code: string) => {
    try {
      const response = await api.post("/api/auth/validate-google-token", {
        code,
      });
      console.log(response);
      const { token } = response.data;
      localStorage.setItem("token", token);
      setToken(token);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: string,
      location?: string,
      latitude?: number,
      longitude?: number
    ) => {
      try {
        const response = await api.post("/api/auth/register", {
          email,
          password,
          name,
          role,
          location,
          latitude,
          longitude
        });
        console.log(response);
        const { token, role: userRole, id } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole);
        localStorage.setItem("id", id);
        setToken(token);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.get("api/auth/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.clear();
      setToken(null);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, [token]);

  const passwordResetRequest = useCallback(
    async (email: string, role: string) => {
      try {
        await api.post("/api/auth/passwordreset/request", { email, role }); // include role here
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    []
  );

  const updateProfile = useCallback(
    async (name: string, email: string) => {
      try {
        const response = await api.post(
          "api/customer/edit-profile",
          { email, name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [token]
  );

  const updateEateryUser = useCallback(
    async (restaurant_name: string, email: string) => {
      try {
        const response = await api.put(
          "api/eatery/edit-profile",
          { email, restaurant_name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [token]
  );

  const passwordReset = useCallback(
    async (resetToken: string, newPassword: string) => {
      try {
        await api.post("/api/auth/password/reset", { resetToken, newPassword });
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    []
  );

  const isAuthenticated = () => Boolean(token);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get("api/auth/whoami", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [token]);

  const getAllReviews = useCallback(
    async (eateryId: string) => {
      try {
        const response = await api.post(
          "api/get_all_reviews",
          { eatery_id: eateryId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data.reviews;
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const getUserById = useCallback(
    async (id: string) => {
      try {
        const response = await api.get(`/api/user/${id}`);
        return response.data;
      } catch (error) {
        console.error(error);
      }
    },
    [token]
  );

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        const response = await api.post(
          "api/auth/password/update",
          { current_password: currentPassword, new_password: newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data.success;
      } catch (error) {
        console.error(error);
      }
    },
    [token, api]
  );

  return (
    <AuthContext.Provider
      value={{
        updateProfile,
        updateEateryUser,
        googleLogin,
        getUserById,
        getAllReviews,
        fetchUser,
        isAuthenticated,
        login,
        logout,
        register,
        passwordResetRequest,
        passwordReset,
        setUser,
        user,
        token,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;