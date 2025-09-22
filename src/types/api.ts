

export interface ValidationError {
  field: string;
  message: string;
}

// New backend error format
export interface BackendErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
  errors?: ValidationError[]; // For validation errors
}

// Axios error wrapper for the new format
export interface ApiErrorResponse {
  response?: {
    status: number;
    data: BackendErrorResponse;
  };
  message?: string;
}

// Legacy interface (keeping for backward compatibility)
export interface LegacyApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: ValidationError[];
    };
  };
  message?: string;
}

// New standardized API response format
export interface StandardApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  data: T;
  message: string;
}

// Legacy API response format (keeping for backward compatibility)
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}