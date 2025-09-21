// src/lib/utils.ts
import { VALIDATION } from "./constants";
import type { ApiErrorResponse } from "@/types/api";

export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatError(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const apiError = error as ApiErrorResponse;
    
    // New backend error format
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
    
    // Fallback to generic message property
    const genericError = error as { message?: string };
    if (genericError.message) {
      return genericError.message;
    }
  }
  return "An unexpected error occurred";
}

export function validateEmailFormat(email: string): boolean {
  return VALIDATION.EMAIL_REGEX.test(email);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
