import axios from 'axios';

import type { AxiosError, AxiosInstance } from 'axios';
import type {
  AuthResponse,
  CreateDamagedRoadRequest,
  DamagedRoadListResponse,
  DamagedRoadResponse,
  ErrorResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateStatusRequest,
  UserProfile,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

class ApiClient {
  private client: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ErrorResponse>) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
          try {
            const newToken = await this.handleTokenRefresh();
            originalRequest.headers['X-Retry'] = 'true';
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.clearTokens();
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async handleTokenRefresh(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    this.refreshTokenPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await this.client.post<RefreshTokenResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      this.setTokens(response.data.access_token, refreshToken);
      this.refreshTokenPromise = null;
      return response.data.access_token;
    })();

    return this.refreshTokenPromise;
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  private setUserProfile(user: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('user_profile', JSON.stringify(user));
  }

  private getUserProfile(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await this.client.post<RegisterResponse>('/auth/register', data);
    // Registration doesn't return tokens, user needs to login after registering
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/auth/login', data);
    this.setTokens(response.data.access_token, response.data.refresh_token);
    this.setUserProfile(response.data.user);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await this.client.post<RefreshTokenResponse>('/auth/refresh', data);
    this.setTokens(response.data.access_token, data.refresh_token);
    return response.data;
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    await this.client.post('/auth/password/reset-request', data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await this.client.post('/auth/password/reset-confirm', data);
  }

  async getProfile(): Promise<UserProfile> {
    // Get user profile from localStorage (set during login/register)
    const profile = this.getUserProfile();
    if (!profile) {
      throw new Error('No user profile found. Please login again.');
    }
    return profile;
  }

  // Damaged roads endpoints
  async createDamagedRoad(data: CreateDamagedRoadRequest): Promise<DamagedRoadResponse> {
    const response = await this.client.post<DamagedRoadResponse>('/damaged-roads', data);
    return response.data;
  }

  async getDamagedRoad(id: string): Promise<DamagedRoadResponse> {
    const response = await this.client.get<DamagedRoadResponse>(`/damaged-roads/${id}`);
    return response.data;
  }

  async listDamagedRoads(params?: {
    page?: number;
    per_page?: number;
    status?: string;
    subdistrict_code?: string;
  }): Promise<DamagedRoadListResponse> {
    const response = await this.client.get<DamagedRoadListResponse>('/damaged-roads', { params });
    return response.data;
  }

  async updateDamagedRoadStatus(id: string, data: UpdateStatusRequest): Promise<DamagedRoadResponse> {
    const response = await this.client.put<DamagedRoadResponse>(`/damaged-roads/${id}/status`, data);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const apiClient = new ApiClient();
