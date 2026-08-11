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

/**
 * Payload used when creating or updating a warehouse.
 *
 * The backend accepts the same basic fields for both operations.
 */
export interface WarehousePayload {
  name: string;
  county: string;
  sub_county?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  manager_name?: string | null;
  manager_phone?: string | null;
  status?: string;
}

export interface WarehouseCreate extends WarehousePayload {}

export interface WarehouseUpdate {
  name?: string;
  county?: string;
  sub_county?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  capacity?: number;
  manager_name?: string | null;
  manager_phone?: string | null;
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
