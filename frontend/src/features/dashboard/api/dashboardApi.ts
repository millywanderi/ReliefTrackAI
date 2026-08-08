import api from "@/services/api";
import type { DashboardData } from "../types";

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<DashboardData>(
    "/api/v1/dashboard/",
  );

  return response.data;
}
