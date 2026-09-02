import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * Standard API Error Response Structure
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.automart.example.com/v1';

/**
 * Core Axios Instance configured with defaults
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ==========================================
// Request Interceptor: Auth & Headers
// ==========================================
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Check for client-side execution before accessing localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('automart_auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor: Error Transformation
// ==========================================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    const customError: ApiErrorResponse = {
      message: 'An unexpected error occurred. Please try again.',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors,
    };

    if (error.response?.data?.message) {
      customError.message = error.response.data.message;
    } else if (error.message) {
      customError.message = error.message;
    }

    // Handle Unauthorized / Session Expiry
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('automart_auth_token');
      // Option to emit event or redirect to login
    }

    return Promise.reject(customError);
  }
);

/**
 * Generic Typed API Request Wrappers
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete<T>(url, config).then((res) => res.data),

  /**
   * Multipart Form-Data Uploader for Media Pipeline
   */
  upload: <T>(
    url: string,
    formData: FormData,
    onProgress?: (percentage: number) => void
  ): Promise<T> =>
    apiClient
      .post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      })
      .then((res) => res.data),
};

export default api;
