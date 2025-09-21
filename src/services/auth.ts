// src/services/auth.ts
import apiClient from "./apiClient";
import { LoginData, RegisterData, AuthResponse, User, UserProfileResponse, AuthTokenData, RefreshTokenData } from "@/types/auth";
import { ApiErrorResponse, StandardApiResponse } from "@/types/api";
import { STORAGE_KEYS, API_ENDPOINTS } from "@/lib/constants";

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    // Basit validasyon
    if (!data.email || !data.password) {
      return {
        success: false,
        message: "Email ve şifre gereklidir.",
      };
    }

    const res = await apiClient.post<StandardApiResponse<AuthTokenData>>(API_ENDPOINTS.AUTH.LOGIN, {
      email: data.email,
      password: data.password,
    });
    
    // Extract tokens from the nested data object
    const authData = res.data.data;
    
    if (authData.access_token && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.access_token);
      if (authData.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refresh_token);
      }
      if (authData.user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));
      }
    }
    
    return {
      success: true,
      access_token: authData.access_token,
      refresh_token: authData.refresh_token,
      user: authData.user,
    };
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    return {
      success: false,
      message: apiError.response?.data?.message || "Giriş başarısız. Lütfen tekrar deneyin.",
    };
  }
}

export async function getUserProfile(): Promise<UserProfileResponse> {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: "No auth token found" };
    }

    const res = await apiClient.get<StandardApiResponse<User>>(API_ENDPOINTS.AUTH.PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      user: res.data.data,
    };
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;

    if (apiError.response?.status === 401) {
      logout();
    }
    return {
      success: false,
      message: apiError.response?.data?.message || "Failed to get user profile",
    };
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    // Basit validasyon
    if (!data.name || !data.email || !data.password) {
      return {
        success: false,
        message: "Tüm gerekli alanlar doldurulmalıdır.",
      };
    }

    const res = await apiClient.post<StandardApiResponse<AuthTokenData>>(API_ENDPOINTS.AUTH.REGISTER, {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
      age: data.age,
    });
    
    // Extract tokens from the nested data object
    const authData = res.data.data;
    
    if (authData.access_token && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.access_token);
      if (authData.refresh_token) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refresh_token);
      }
      if (authData.user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user));
      }
    }
    
    return {
      success: true,
      access_token: authData.access_token,
      refresh_token: authData.refresh_token,
      user: authData.user,
    };
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    return {
      success: false,
      message: apiError.response?.data?.message || "Kayıt başarısız. Lütfen tekrar deneyin.",
    };
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
  window.location.href = "/auth/login";
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

export function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

export async function refreshAuthToken(): Promise<{ success: boolean; access_token?: string; message?: string }> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return { success: false, message: "No refresh token found" };
    }

    const res = await apiClient.post<StandardApiResponse<RefreshTokenData>>(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token: refreshToken,
    });

    // Extract token from the nested data object
    const tokenData = res.data.data;

    if (tokenData.access_token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, tokenData.access_token);
    }

    return {
      success: true,
      access_token: tokenData.access_token,
    };
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    logout();
    return {
      success: false,
      message: apiError.response?.data?.message || "Token refresh failed",
    };
  }
}

export async function ensureValidToken(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  try {
    await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return true;
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;
    if (apiError.response?.status === 401) {
      const refreshResult = await refreshAuthToken();
      return refreshResult.success;
    }
    return false;
  }
}
