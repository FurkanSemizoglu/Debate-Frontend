

export interface ValidationError {
  field: string;
  message: string;
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



export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  error: string;
}