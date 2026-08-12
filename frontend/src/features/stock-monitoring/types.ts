export type StockStatus =
  | "OUT OF STOCK"
  | "LOW STOCK"
  | "NORMAL";

export interface StockMonitoring {
  warehouse_id: number;
  warehouse: string;
  resource_id: number;
  resource: string;
  current_stock: number;
  minimum_stock: number;
  status: StockStatus | string;
}
