
export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

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

export interface AuthTokenData {
  access_token: string;
  refresh_token: string;
  user?: User;
}

export interface RefreshTokenData {
  access_token: string;
}

export interface AuthResponse {
  success: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: User;
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  user?: User;
  message?: string;
}