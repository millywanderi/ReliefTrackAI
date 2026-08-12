import api from "@/services/api";

import type { StockMonitoring } from "../types";

export async function getStockMonitoring(): Promise<
  StockMonitoring[]
> {
  const response = await api.get<StockMonitoring[]>(
    "/api/v1/stock-monitoring/",
  );

  return response.data;
}
