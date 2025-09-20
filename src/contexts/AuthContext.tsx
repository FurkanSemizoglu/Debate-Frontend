"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuthToken, logout, getUserProfile } from "@/services/auth";
import { User, AuthContextType } from "@/types/auth";
import { STORAGE_KEYS } from "@/lib/constants";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuth = async () => {
      try {
        const token = getAuthToken();
        
        if (token) {
          // First check if we have cached user data
          const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
          
          if (userData) {
            const parsedUserData = JSON.parse(userData);
            setUser(parsedUserData);
          } else {
            // If no cached data, try to fetch user profile
            try {
              const profileResponse = await getUserProfile();
              if (profileResponse.success && profileResponse.user) {
                setUser(profileResponse.user);
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(profileResponse.user));
              } else {
                // If profile fetch fails, clear invalid token
                handleLogout();
              }
            } catch (error) {
              console.error("Error fetching user profile:", error);
              handleLogout();
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Clear invalid token and user data
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (user: User, token: string) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;