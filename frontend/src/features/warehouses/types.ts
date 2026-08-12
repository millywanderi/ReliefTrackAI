export interface Warehouse {
  id: number;
  name: string;
  county: string;
  sub_county?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  manager_name?: string | null;
  manager_phone?: string | null;
  status: string;
  created_at: string;
}

export interface WarehouseCreate {
  name: string;
  county: string;
  sub_county?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  manager_name?: string;
  manager_phone?: string;
  status?: string;
}

export type WarehousePayload = WarehouseCreate;

export interface WarehouseUpdate {
  name?: string;
  county?: string;
  sub_county?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  manager_name?: string;
  manager_phone?: string;
  status?: string;
}

export interface StockMonitoring {
  warehouse_id: number;
  warehouse: string;
  resource_id: number;
  resource: string;
  current_stock: number;
  minimum_stock: number;
  status: string;
}

export interface StockTransaction {
  id: number;
  warehouse_id: number;
  resource_id: number;
  transaction_type: string;
  quantity: number;
  reference?: string | null;
  notes?: string | null;
  created_by: number;
  created_at: string;
}
