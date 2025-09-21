// src/lib/constants.ts

// localStorage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "authToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
    REFRESH: "/auth/refresh",
  },
} as const;

// Validation constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Debate status labels
export const DEBATE_STATUS = {
  WAITING: "Bekliyor",
  ACTIVE: "Aktif", 
  COMPLETED: "Tamamlandı",
  CANCELLED: "İptal Edildi",
} as const;

// Debate categories
export const DEBATE_CATEGORIES = {
  POLITICS: "Politik",
  SCIENCE: "Bilim",
  TECHNOLOGY: "Teknoloji",
  SOCIAL: "Sosyal",
  ECONOMICS: "Ekonomi",
  PHILOSOPHY: "Felsefe",
  SPORTS: "Spor",
  ARTS: "Sanat",
  EDUCATION: "Eğitim",
  HEALTH: "Sağlık",
  SOCIETY: "Toplum",
  ENVIRONMENT: "Çevre",
} as const;