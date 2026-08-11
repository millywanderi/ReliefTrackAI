import api from "@/services/api";

import type {
  Resource,
  ResourcePayload,
  StockMonitoring,
  StockTransaction,
  StockTransactionPayload,
} from "../types";

export async function getResources(params?: {
  search?: string;
  category?: string;
}) {
  const response = await api.get<Resource[]>(
    "/api/v1/resources/",
    {
      params: {
        ...params,
        page: 1,
        limit: 100,
      },
    },
  );

  return response.data;
}

export async function createResource(
  payload: ResourcePayload,
) {
  const response = await api.post<Resource>(
    "/api/v1/resources/",
    payload,
  );

  return response.data;
}

export async function updateResource(
  id: number,
  payload: Partial<ResourcePayload>,
) {
  const response = await api.put<Resource>(
    `/api/v1/resources/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteResource(id: number) {
  await api.delete(`/api/v1/resources/${id}`);
}

export async function getStockMonitoring() {
  const response = await api.get<StockMonitoring[]>(
    "/api/v1/stock-monitoring/",
  );

  return response.data;
}

export async function getStockTransactions() {
  const response = await api.get<StockTransaction[]>(
    "/api/v1/stock-transactions/",
  );

  return response.data;
}

export async function createStockTransaction(
  payload: StockTransactionPayload,
) {
  const response =
    await api.post<StockTransaction>(
      "/api/v1/stock-transactions/",
      payload,
    );

  return response.data;
}

export async function deleteStockTransaction(
  id: number,
) {
  await api.delete(
    `/api/v1/stock-transactions/${id}`,
  );
}
