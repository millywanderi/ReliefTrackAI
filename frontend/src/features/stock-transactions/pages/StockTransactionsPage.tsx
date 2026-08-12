import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStockTransaction,
  deleteStockTransaction,
  getStockTransactions,
} from "../api/stockTransactionsApi";

import { getWarehouses } from "@/features/warehouses/api/warehousesApi";
import { getResources } from "@/features/resources/api/resourcesApi";

import type {
  StockTransaction,
  StockTransactionPayload,
  TransactionType,
} from "../types";

function StockTransactionsPage() {
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);

  const transactionsQuery = useQuery({
    queryKey: ["stock-transactions"],
    queryFn: getStockTransactions,
  });

  const warehousesQuery = useQuery({
    queryKey: ["warehouses"],
    queryFn: () => getWarehouses(),
  });

  const resourcesQuery = useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(),
  });

  const createMutation = useMutation({
    mutationFn: createStockTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stock-monitoring"],
      });

      setShowForm(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStockTransaction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["stock-transactions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stock-monitoring"],
      });
    },
  });

  const transactions = transactionsQuery.data ?? [];
  const warehouses = warehousesQuery.data ?? [];
  const resources = resourcesQuery.data ?? [];

  const getWarehouseName = (id: number) => {
    return (
      warehouses.find(
        (warehouse) => warehouse.id === id,
      )?.name ?? `Warehouse #${id}`
    );
  };

  const getResourceName = (id: number) => {
    return (
      resources.find(
        (resource) => resource.id === id,
      )?.name ?? `Resource #${id}`
    );
  };

  const handleDelete = (
    transaction: StockTransaction,
  ) => {
    const confirmed = window.confirm(
      "Delete this stock transaction?",
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(transaction.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Stock Transactions
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record and track stock movements across warehouses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Record Transaction
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Transactions"
          value={transactions.length}
          icon={<ClipboardList size={20} />}
        />

        <SummaryCard
          title="Stock In"
          value={
            transactions.filter(
              (transaction) =>
                transaction.transaction_type ===
                  "STOCK_IN" ||
                transaction.transaction_type ===
                  "TRANSFER_IN",
            ).length
          }
          icon={<ArrowDownToLine size={20} />}
        />

        <SummaryCard
          title="Stock Out"
          value={
            transactions.filter(
              (transaction) =>
                transaction.transaction_type ===
                  "STOCK_OUT" ||
                transaction.transaction_type ===
                  "TRANSFER_OUT" ||
                transaction.transaction_type ===
                  "DAMAGED",
            ).length
          }
          icon={<ArrowUpFromLine size={20} />}
        />
      </div>

      {/* Loading */}
      {transactionsQuery.isLoading && (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading stock transactions...
          </p>
        </div>
      )}

      {/* Error */}
      {transactionsQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load stock transactions
          </h3>

          <p className="mt-1 text-sm text-red-700">
            Please check your connection and try again.
          </p>
        </div>
      )}

      {/* Table */}
      {!transactionsQuery.isLoading &&
        !transactionsQuery.isError && (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Warehouse
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resource
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Transaction
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Reference
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {transactions.map(
                    (transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm text-slate-700">
                            {new Date(
                              transaction.created_at,
                            ).toLocaleDateString()}
                          </p>

                          <p className="text-xs text-slate-400">
                            {new Date(
                              transaction.created_at,
                            ).toLocaleTimeString()}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {getWarehouseName(
                              transaction.warehouse_id,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {getResourceName(
                              transaction.resource_id,
                            )}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <TransactionBadge
                            type={
                              transaction.transaction_type
                            }
                          />
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-slate-900">
                            {transaction.quantity.toLocaleString()}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[180px] truncate text-sm text-slate-600">
                            {transaction.reference ||
                              "—"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  transaction,
                                )
                              }
                              disabled={
                                deleteMutation.isPending
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                              title="Delete transaction"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}

                  {transactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-5 py-12 text-center"
                      >
                        <ClipboardList
                          size={32}
                          className="mx-auto text-slate-300"
                        />

                        <p className="mt-3 font-medium text-slate-700">
                          No transactions found
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Record a transaction to
                          start tracking stock.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      {/* Form */}
      {showForm && (
        <StockTransactionForm
          warehouses={warehouses}
          resources={resources}
          isSubmitting={
            createMutation.isPending
          }
          onClose={() => setShowForm(false)}
          onSubmit={(data) =>
            createMutation.mutate(data)
          }
        />
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

function TransactionBadge({
  type,
}: {
  type: TransactionType;
}) {
  const incoming =
    type === "STOCK_IN" ||
    type === "TRANSFER_IN";

  const outgoing =
    type === "STOCK_OUT" ||
    type === "TRANSFER_OUT" ||
    type === "DAMAGED";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        incoming
          ? "bg-emerald-50 text-emerald-700"
          : outgoing
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {type.replaceAll("_", " ")}
    </span>
  );
}

interface StockTransactionFormProps {
  warehouses: {
    id: number;
    name: string;
  }[];

  resources: {
    id: number;
    name: string;
    unit: string;
  }[];

  isSubmitting: boolean;

  onClose: () => void;

  onSubmit: (
    data: StockTransactionPayload,
  ) => void;
}

function StockTransactionForm({
  warehouses,
  resources,
  isSubmitting,
  onClose,
  onSubmit,
}: StockTransactionFormProps) {
  const [form, setForm] =
    useState<StockTransactionPayload>({
      warehouse_id: 0,
      resource_id: 0,
      transaction_type: "STOCK_IN",
      quantity: 0,
      reference: "",
      notes: "",
    });

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,
      quantity: Number(form.quantity),
      reference:
        form.reference?.trim() || undefined,
      notes:
        form.notes?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Record Stock Transaction
            </h2>

            <p className="text-sm text-slate-500">
              Record a movement of resources in the
              inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Warehouse
              </label>

              <select
                value={form.warehouse_id}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    warehouse_id: Number(
                      event.target.value,
                    ),
                  }))
                }
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value={0}>
                  Select warehouse
                </option>

                {warehouses.map(
                  (warehouse) => (
                    <option
                      key={warehouse.id}
                      value={warehouse.id}
                    >
                      {warehouse.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Resource
              </label>

              <select
                value={form.resource_id}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    resource_id: Number(
                      event.target.value,
                    ),
                  }))
                }
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value={0}>
                  Select resource
                </option>

                {resources.map(
                  (resource) => (
                    <option
                      key={resource.id}
                      value={resource.id}
                    >
                      {resource.name} (
                      {resource.unit})
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Transaction Type
              </label>

              <select
                value={form.transaction_type}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    transaction_type:
                      event.target
                        .value as TransactionType,
                  }))
                }
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="STOCK_IN">
                  Stock In
                </option>

                <option value="STOCK_OUT">
                  Stock Out
                </option>

                <option value="TRANSFER_IN">
                  Transfer In
                </option>

                <option value="TRANSFER_OUT">
                  Transfer Out
                </option>

                <option value="ADJUSTMENT">
                  Adjustment
                </option>

                <option value="DAMAGED">
                  Damaged
                </option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Quantity
              </label>

              <input
                type="number"
                min={1}
                value={form.quantity}
                required
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    quantity: Number(
                      event.target.value,
                    ),
                  }))
                }
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Reference
            </label>

            <input
              type="text"
              value={form.reference ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  reference:
                    event.target.value,
                }))
              }
              placeholder="e.g. GRN-2026-001"
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Notes
            </label>

            <textarea
              value={form.notes ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              rows={4}
              placeholder="Additional information..."
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                form.warehouse_id === 0 ||
                form.resource_id === 0 ||
                form.quantity <= 0
              }
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : "Record Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StockTransactionsPage;
