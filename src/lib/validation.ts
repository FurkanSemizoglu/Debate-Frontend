import { VALIDATION } from "./constants";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): string | null {
  if (!email) {
    return "E-posta adresi gereklidir";
  }
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return "Geçerli bir e-posta adresi girin";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Şifre gereklidir";
  }
  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return `Şifre en az ${VALIDATION.MIN_PASSWORD_LENGTH} karakter olmalıdır`;
  }
  return null;
}

export function validateName(name: string): string | null {
  if (!name) {
    return "Ad gereklidir";
  }
  if (name.trim().length < 2) {
    return "Ad en az 2 karakter olmalıdır";
  }
  return null;
}

export function validateSurname(surname: string): string | null {
  if (!surname) {
    return "Soyad gereklidir";
  }
  if (surname.trim().length < 2) {
    return "Soyad en az 2 karakter olmalıdır";
  }
  return null;
}

export function validateAge(age: number): string | null {
  if (!age) {
    return "Yaş gereklidir";
  }
  if (age < 13) {
    return "Yaş en az 13 olmalıdır";
  }
  if (age > 120) {
    return "Geçerli bir yaş girin";
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return "Şifre tekrarı gereklidir";
  }
  if (password !== confirmPassword) {
    return "Şifreler eşleşmiyor";
  }
  return null;
}

export function getPasswordStrength(password: string): {
  score: number;
  text: string;
  color: string;
} {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score === 0) return { score: 0, text: "", color: "" };
  if (score <= 2) return { score, text: "Zayıf", color: "text-red-500" };
  if (score <= 3) return { score, text: "Orta", color: "text-yellow-500" };
  if (score <= 4) return { score, text: "İyi", color: "text-blue-500" };
  return { score, text: "Güçlü", color: "text-green-500" };
}

export function validateTitle(title: string): string | null {
  if (!title) {
    return "Başlık gereklidir";
  }
  if (title.trim().length < 5) {
    return "Başlık en az 5 karakter olmalıdır";
  }
  if (title.trim().length > 100) {
    return "Başlık en fazla 100 karakter olabilir";
  }
  return null;
}

export function validateTopic(topic: string): string | null {
  if (!topic) {
    return "Konu gereklidir";
  }
  if (topic.trim().length < 10) {
    return "Konu açıklaması en az 10 karakter olmalıdır";
  }
  if (topic.trim().length > 500) {
    return "Konu açıklaması en fazla 500 karakter olabilir";
  }
  return null;
}
