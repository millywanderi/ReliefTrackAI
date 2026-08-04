export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role_id?: number;
  role?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
