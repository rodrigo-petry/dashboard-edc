export interface AuthRequest {
  email: string;
  pass: string;
}

export interface AuthResponse {
  id: number;
  token: string;
}

export interface UserAuthData {
  id: number;
  token: string;
  email: string;
}
