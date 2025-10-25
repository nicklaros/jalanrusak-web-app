// API Types based on backend swagger documentation

export interface Point {
  latitude: number;
  longitude: number;
}

export interface PointDTO {
  latitude: number;
  longitude: number;
}

export interface GeometryDTO {
  type: string; // e.g., "LineString"
  coordinates: number[][]; // Array of [longitude, latitude] pairs
}

export interface DamagedRoadResponse {
  id: string;
  author_id: string;
  title: string;
  subdistrict_code: string;
  path: GeometryDTO;
  photo_urls: string[];
  description?: string;
  status: 'submitted' | 'under_verification' | 'verified' | 'pending_resolved' | 'resolved' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CreateDamagedRoadRequest {
  title: string;
  subdistrict_code: string;
  path_points: PointDTO[];
  photo_urls: string[];
  description?: string;
}

export interface UpdateStatusRequest {
  status: 'submitted' | 'under_verification' | 'verified' | 'pending_resolved' | 'resolved' | 'archived';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  offset: number;
  total: number;
}

export interface DamagedRoadListResponse {
  data: DamagedRoadResponse[];
  pagination: PaginationMeta;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'verificator';
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserProfile;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}
