export interface Warehouse {
  id: number;
  name: string;
  county: string;
  sub_county: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  manager_name: string | null;
  manager_phone: string | null;
  status: string;
  created_at: string;
}

export interface WarehouseCreate {
  name: string;
  county: string;
  sub_county?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  capacity: number;
  manager_name?: string;
  manager_phone?: string;
  status: string;
}

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
