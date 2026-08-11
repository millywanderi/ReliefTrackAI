import api from "@/services/api";
import type {
  Warehouse,
  WarehousePayload,
} from "../types";

export async function getWarehouses(params?: {
  search?: string;
  county?: string;
  status?: string;
}) {
  const response = await api.get<Warehouse[]>(
    "/api/v1/warehouses/",
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

export async function createWarehouse(
  payload: WarehousePayload,
) {
  const response = await api.post<Warehouse>(
    "/api/v1/warehouses/",
    payload,
  );

  return response.data;
}

export async function updateWarehouse(
  id: number,
  payload: Partial<WarehousePayload>,
) {
  const response = await api.put<Warehouse>(
    `/api/v1/warehouses/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteWarehouse(id: number) {
  await api.delete(`/api/v1/warehouses/${id}`);
}
