export interface Resource {
  id: number;
  name: string;
  category: string;
  unit: string;
  minimum_stock: number;
  description: string | null;
  created_at: string;
}

export interface ResourcePayload {
  name: string;
  category: string;
  unit: string;
  minimum_stock: number;
  description?: string;
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

export type TransactionType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "TRANSFER_IN"
  | "TRANSFER_OUT"
  | "ADJUSTMENT"
  | "DAMAGED";


export interface StockTransaction {
  id: number;
  warehouse_id: number;
  resource_id: number;
  transaction_type: TransactionType;
  quantity: number;
  reference: string | null;
  notes: string | null;
  created_by: number;
  created_at: string;
}

export interface StockTransactionPayload {
  warehouse_id: number;
  resource_id: number;
  transaction_type: TransactionType;
  quantity: number;
  reference?: string;
  notes?: string;
}
