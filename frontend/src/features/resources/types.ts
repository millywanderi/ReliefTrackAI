export interface Resource {
  id: number;
  name: string;
  category: string;
  unit: string;
  minimum_stock: number;
  description?: string | null;
  created_at: string;
}

export interface ResourceFilters {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface ResourceCreate {
  name: string;
  category: string;
  unit: string;
  minimum_stock?: number;
  description?: string;
}

export interface ResourceUpdate {
  name?: string;
  category?: string;
  unit?: string;
  minimum_stock?: number;
  description?: string;
}

export type ResourcePayload = ResourceCreate;
