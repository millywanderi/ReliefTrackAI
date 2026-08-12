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
  reference?: string | null;
  notes?: string | null;
  created_by: number;
  created_at: string;
}

export interface StockTransactionCreate {
  warehouse_id: number;
  resource_id: number;
  transaction_type: TransactionType;
  quantity: number;
  reference?: string;
  notes?: string;
}

export type StockTransactionPayload =
  StockTransactionCreate;
