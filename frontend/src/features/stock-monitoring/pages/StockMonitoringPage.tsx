import { useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Package,
  Search,
  Warehouse,
  XCircle,
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

  const [search, setSearch] = useState("");

  const filteredInventory = inventory.filter((item) => {
    const searchTerm = search.toLowerCase().trim();

    if (!searchTerm) {
      return true;
    }

    return (
      item.warehouse.toLowerCase().includes(searchTerm) ||
      item.resource.toLowerCase().includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm)
    );
  });

  const outOfStock = inventory.filter(
    (item) => item.status === "OUT OF STOCK",
  ).length;

  const lowStock = inventory.filter(
    (item) => item.status === "LOW STOCK",
  ).length;

  const normalStock = inventory.filter(
    (item) => item.status === "NORMAL",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Stock Monitoring
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor current inventory levels and identify
          resources that need replenishment.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Inventory Items"
          value={inventory.length}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="Normal Stock"
          value={normalStock}
          icon={<CheckCircle2 size={20} />}
        />

        <SummaryCard
          title="Low Stock"
          value={lowStock}
          icon={<AlertTriangle size={20} />}
        />

        <SummaryCard
          title="Out of Stock"
          value={outOfStock}
          icon={<XCircle size={20} />}
        />
      </div>

      {/* Search */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search warehouse, resource, or status..."
            className="w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-slate-400"
          />
        </div>
      </section>

      {/* Loading */}
      {query.isLoading && (
        <div className="rounded-2xl border bg-white p-10 text-center">
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

      {/* Table */}
      {!query.isLoading && !query.isError && (
        <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
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
                    Stock Level
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredInventory.map((item) => (
                  <tr
                    key={`${item.warehouse_id}-${item.resource_id}`}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <Warehouse size={19} />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {item.warehouse}
                          </p>

                          <p className="text-xs text-slate-500">
                            Warehouse #{item.warehouse_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <Package size={17} />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {item.resource}
                          </p>

                          <p className="text-xs text-slate-500">
                            Resource #{item.resource_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.current_stock.toLocaleString()}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {item.minimum_stock.toLocaleString()}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <StockBar
                        current={item.current_stock}
                        minimum={item.minimum_stock}
                      />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}

                {filteredInventory.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <Package
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-700">
                        No inventory found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
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

function StatusBadge({
  status,
}: {
  status: StockMonitoring["status"];
}) {
  if (status === "OUT OF STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
        <XCircle size={14} />
        Out of Stock
      </span>
    );
  }

  if (status === "LOW STOCK") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
        <AlertTriangle size={14} />
        Low Stock
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle2 size={14} />
      Normal
    </span>
  );
}

function StockBar({
  current,
  minimum,
}: {
  current: number;
  minimum: number;
}) {
  const percentage =
    minimum > 0
      ? Math.min((current / minimum) * 100, 100)
      : current > 0
        ? 100
        : 0;

  const isOut = current <= 0;
  const isLow = current > 0 && current < minimum;

  return (
    <div className="w-40">
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={[
            "h-full rounded-full transition-all",
            isOut
              ? "bg-red-500"
              : isLow
                ? "bg-amber-500"
                : "bg-emerald-500",
          ].join(" ")}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-1 text-xs text-slate-400">
        {minimum > 0
          ? `${Math.round(
              (current / minimum) * 100,
            )}% of minimum`
          : "No minimum set"}
      </p>
    </div>
  );
}

export default StockMonitoringPage;
