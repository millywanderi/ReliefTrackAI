export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
