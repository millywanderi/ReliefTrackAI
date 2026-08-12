import api from "@/services/api";

import type {
  Resource,
  ResourceCreate,
  ResourceFilters,
  ResourceUpdate,
} from "../types";

export async function getResources(
  filters: ResourceFilters = {},
): Promise<Resource[]> {
  const response = await api.get<Resource[]>(
    "/api/v1/resources/",
    {
      params: {
        search: filters.search || undefined,
        category: filters.category || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? 20,
      },
    },
  );

  return response.data;
}

export async function getResource(
  id: number,
): Promise<Resource> {
  const response = await api.get<Resource>(
    `/api/v1/resources/${id}`,
  );

  return response.data;
}

export async function createResource(
  data: ResourceCreate,
): Promise<Resource> {
  const response = await api.post<Resource>(
    "/api/v1/resources/",
    data,
  );

  return response.data;
}

export async function updateResource(
  id: number,
  data: ResourceUpdate,
): Promise<Resource> {
  const response = await api.put<Resource>(
    `/api/v1/resources/${id}`,
    data,
  );

  return response.data;
}

export async function deleteResource(
  id: number,
): Promise<void> {
  await api.delete(`/api/v1/resources/${id}`);
}
