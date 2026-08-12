import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Warehouse,
} from "lucide-react";

import { useQuery } from "@tanstack/react-query";

import { getStockMonitoring } from "../api/stockMonitoringApi";

import type { StockMonitoring } from "../types";

function StockMonitoringPage() {
  const query = useQuery({
    queryKey: ["stock-monitoring"],
    queryFn: getStockMonitoring,
  });

  const inventory = query.data ?? [];

  const outOfStock = inventory.filter(
    (item) => item.status === "OUT OF STOCK",
  );

  const lowStock = inventory.filter(
    (item) => item.status === "LOW STOCK",
  );

  const normalStock = inventory.filter(
    (item) => item.status === "NORMAL",
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Stock Monitoring
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor current stock levels across warehouses and
          identify resources that need attention.
        </p>
      </div>

      {/* Loading */}
      {query.isLoading && (
        <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading stock levels...
          </p>
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load stock monitoring
          </h3>

          <p className="mt-1 text-sm text-red-700">
            Please check your connection and try again.
          </p>
        </div>
      )}

      {!query.isLoading && !query.isError && (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Inventory Items"
              value={inventory.length}
              icon={<Package size={20} />}
            />

            <SummaryCard
              title="Normal Stock"
              value={normalStock.length}
              icon={<CheckCircle2 size={20} />}
            />

            <SummaryCard
              title="Low Stock"
              value={lowStock.length}
              icon={<AlertTriangle size={20} />}
            />

            <SummaryCard
              title="Out of Stock"
              value={outOfStock.length}
              icon={<AlertTriangle size={20} />}
            />
          </div>

          {/* Inventory Table */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Current Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current stock calculated from recorded stock
                transactions.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Warehouse
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resource
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Current Stock
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Minimum Stock
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {inventory.map((item) => (
                    <StockRow
                      key={`${item.warehouse_id}-${item.resource_id}`}
                      item={item}
                    />
                  ))}

                  {inventory.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-12 text-center"
                      >
                        <Package
                          size={32}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 font-medium text-slate-700">
                          No inventory data
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Record stock transactions to see
                          current inventory levels.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function StockRow({
  item,
}: {
  item: StockMonitoring;
}) {
  const statusClass =
    item.status === "OUT OF STOCK"
      ? "bg-red-50 text-red-700"
      : item.status === "LOW STOCK"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <tr className="hover:bg-slate-50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Warehouse size={17} />
          </div>

          <span className="text-sm font-medium text-slate-800">
            {item.warehouse}
          </span>
        </div>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm font-medium text-slate-800">
          {item.resource}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm font-semibold text-slate-900">
          {item.current_stock.toLocaleString()}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="text-sm text-slate-600">
          {item.minimum_stock.toLocaleString()}
        </span>
      </td>

      <td className="px-5 py-4">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          {item.status}
        </span>
      </td>
    </tr>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default StockMonitoringPage;
