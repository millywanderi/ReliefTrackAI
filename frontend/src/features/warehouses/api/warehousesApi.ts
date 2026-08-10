import api from "@/services/api";
import type {
  Warehouse,
  WarehouseCreate,
  WarehouseUpdate,
} from "../types";

export interface WarehouseFilters {
  search?: string;
  county?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export async function getWarehouses(
  filters: WarehouseFilters = {},
): Promise<Warehouse[]> {
  const response = await api.get<Warehouse[]>(
    "/api/v1/warehouses/",
    {
      params: {
        search: filters.search || undefined,
        county: filters.county || undefined,
        status: filters.status || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      },
    },
  );

  return response.data;
}

export async function getWarehouse(
  warehouseId: number,
): Promise<Warehouse> {
  const response = await api.get<Warehouse>(
    `/api/v1/warehouses/${warehouseId}`,
  );

  return response.data;
}

export async function createWarehouse(
  warehouse: WarehouseCreate,
): Promise<Warehouse> {
  const response = await api.post<Warehouse>(
    "/api/v1/warehouses/",
    warehouse,
  );

  return response.data;
}

export async function updateWarehouse(
  warehouseId: number,
  warehouse: WarehouseUpdate,
): Promise<Warehouse> {
  const response = await api.put<Warehouse>(
    `/api/v1/warehouses/${warehouseId}`,
    warehouse,
  );

  return response.data;
}

export async function deleteWarehouse(
  warehouseId: number,
): Promise<void> {
  await api.delete(
    `/api/v1/warehouses/${warehouseId}`,
  );
}
