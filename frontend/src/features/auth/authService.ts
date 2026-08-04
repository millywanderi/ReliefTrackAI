import api from "@/services/api";
import type { LoginRequest, TokenResponse, User } from "./types";

export async function login(
  credentials: LoginRequest,
): Promise<TokenResponse> {
  const response = await api.post<TokenResponse>(
    "/api/v1/auth/login",
    credentials,
  );

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<User>("/api/v1/auth/me");

  return response.data;
}
