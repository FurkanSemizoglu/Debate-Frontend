

export interface ValidationError {
  field: string;
  message: string;
}

export interface BackendErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
  errors?: ValidationError[]; // For validation errors
}

export interface ApiErrorResponse {
  response?: {
    status: number;
    data: BackendErrorResponse;
  };
  message?: string;
}

export interface LegacyApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: ValidationError[];
    };
  };
  message?: string;
}

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  data: T;
  message: string;
}

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