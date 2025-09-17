// src/services/auth.ts
import apiClient from "./apiClient";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  surname: string;
  email: string;
  password: string;
  age: number;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  message?: string;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    debugger;
    const res = await apiClient.post("/auth/login", {
      email: data.email,
      password: data.password,
    });
    
    if (res.data.access_token) {
      localStorage.setItem("authToken", res.data.access_token);
    }
    
    return {
      success: true,
      ...res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please try again.",
    };
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const res = await apiClient.post("/auth/register", {
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: data.password,
      age: data.age,
    });
    
    // Store token in localStorage if provided
    if (res.data.token) {
      localStorage.setItem("authToken", res.data.token);
    }
    
    return {
      success: true,
      ...res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || "Registration failed. Please try again.",
    };
  }
}

export function logout(): void {
  localStorage.removeItem("authToken");
  // Redirect to login page or home
  window.location.href = "/Auth/login";
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}
