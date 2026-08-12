import api from "@/services/api";

import type {
  StockTransaction,
  StockTransactionCreate,
} from "../types";

export async function getStockTransactions(): Promise<
  StockTransaction[]
> {
  const response = await api.get<StockTransaction[]>(
    "/api/v1/stock-transactions/",
  );

  return response.data;
}

export async function getStockTransaction(
  id: number,
): Promise<StockTransaction> {
  const response = await api.get<StockTransaction>(
    `/api/v1/stock-transactions/${id}`,
  );

  return response.data;
}

export async function createStockTransaction(
  data: StockTransactionCreate,
): Promise<StockTransaction> {
  const response = await api.post<StockTransaction>(
    "/api/v1/stock-transactions/",
    data,
  );

  return response.data;
}

export async function deleteStockTransaction(
  id: number,
): Promise<void> {
  await api.delete(
    `/api/v1/stock-transactions/${id}`,
  );
}
