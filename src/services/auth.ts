// src/services/auth.ts
import apiClient from "./apiClient";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";
import { STORAGE_KEYS, API_ENDPOINTS } from "@/lib/constants";

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    debugger;
    const res = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email: data.email,
      password: data.password,
    });
    
    if (res.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.access_token);
      if (res.data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refresh_token);
      }
    }
    
    return {
      success: true,
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please try again.",
    };
  }
}

export async function getUserProfile(): Promise<{ success: boolean; user?: any; message?: string }> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: "No auth token found" };
    }

    const res = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      user: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to get user profile",
    };
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
      age: data.age,
    });
    
    // Store tokens in localStorage if provided
    if (res.data.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, res.data.access_token);
      if (res.data.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, res.data.refresh_token);
      }
    }
    
    return {
      success: true,
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed. Please try again.",
    };
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  // Redirect to login page or home
  window.location.href = "/Auth/login";
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }
  return null;
}

export function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
