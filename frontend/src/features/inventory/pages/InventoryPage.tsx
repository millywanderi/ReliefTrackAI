import { useMemo, useState } from "react";

import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Edit,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createResource,
  createStockTransaction,
  deleteResource,
  deleteStockTransaction,
  getResources,
  getStockMonitoring,
  getStockTransactions,
  updateResource,
} from "../api/inventoryApi";

import type {
  Resource,
  ResourcePayload,
  StockTransactionPayload,
} from "../types";

import { getWarehouses } from "@/features/warehouses/api/warehousesApi";
import type { TransactionType } from "@/features/stock-transactions/types";

type Tab =
  | "stock"
  | "resources"
  | "transactions";

function InventoryPage() {
  const [activeTab, setActiveTab] =
    useState<Tab>("stock");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Monitor resources, stock levels, and inventory
          transactions.
        </p>
      </div>

      <div className="flex overflow-x-auto rounded-xl border bg-white p-1 shadow-sm">
        <TabButton
          active={activeTab === "stock"}
          onClick={() => setActiveTab("stock")}
        >
          Stock Monitoring
        </TabButton>

        <TabButton
          active={activeTab === "resources"}
          onClick={() => setActiveTab("resources")}
        >
          Resources
        </TabButton>

        <TabButton
          active={activeTab === "transactions"}
          onClick={() =>
            setActiveTab("transactions")
          }
        >
          Transactions
        </TabButton>
      </div>

      {activeTab === "stock" && (
        <StockMonitoringTab />
      )}

      {activeTab === "resources" && (
        <ResourcesTab />
      )}

      {activeTab === "transactions" && (
        <TransactionsTab />
      )}
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition",
        active
          ? "bg-slate-900 text-white"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* =====================================================
   STOCK MONITORING
===================================================== */

function StockMonitoringTab() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const query = useQuery({
    queryKey: [
      "stock-monitoring",
    ],
    queryFn: getStockMonitoring,
  });

  const stock = query.data ?? [];

  const filteredStock = useMemo(() => {
    return stock.filter((item) => {
      const matchesSearch =
        !search ||
        item.resource
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        item.warehouse
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        !status ||
        item.status.toLowerCase() ===
          status.toLowerCase();

      return (
        matchesSearch && matchesStatus
      );
    });
  }, [stock, search, status]);

  const lowStock = stock.filter(
    (item) =>
      item.status.toLowerCase() !==
      "normal",
  ).length;

  const totalStock = stock.reduce(
    (total, item) =>
      total + item.current_stock,
    0,
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <InventorySummary
          title="Stock Records"
          value={stock.length}
          icon={<Package size={20} />}
        />

        <InventorySummary
          title="Low Stock Alerts"
          value={lowStock}
          icon={
            <AlertTriangle size={20} />
          }
        />

        <InventorySummary
          title="Total Stock"
          value={totalStock}
          icon={<Package size={20} />}
        />
      </div>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search resource or warehouse..."
              className="w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="">
              All stock statuses
            </option>
            <option value="NORMAL">
              Normal
            </option>
            <option value="LOW">
              Low
            </option>
            <option value="CRITICAL">
              Critical
            </option>
          </select>
        </div>
      </section>

      {query.isLoading && (
        <LoadingCard text="Loading stock levels..." />
      )}

      {query.isError && (
        <ErrorCard text="Unable to load current stock levels." />
      )}

      {!query.isLoading &&
        !query.isError && (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
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
                      Minimum
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredStock.map((item) => (
                    <tr
                      key={`${item.warehouse_id}-${item.resource_id}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-slate-800">
                        {item.warehouse}
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {item.resource}
                        </p>

                        <p className="text-xs text-slate-500">
                          Resource #{item.resource_id}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-lg font-bold text-slate-900">
                          {item.current_stock.toLocaleString()}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.minimum_stock.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <StockStatus
                          status={item.status}
                        />
                      </td>
                    </tr>
                  ))}

                  {filteredStock.length ===
                    0 && (
                    <EmptyTable
                      message="No stock records found."
                    />
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
    </div>
  );
}

/* =====================================================
   RESOURCES
===================================================== */

function ResourcesTab() {
  const queryClient =
    useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingResource, setEditingResource] =
    useState<Resource | null>(null);

  const query = useQuery({
    queryKey: [
      "resources",
      search,
      category,
    ],
    queryFn: () =>
      getResources({
        search: search || undefined,
        category:
          category || undefined,
      }),
  });

  const resources = query.data ?? [];

  const mutation = useMutation({
    mutationFn: async (payload: {
      id?: number;
      data: ResourcePayload;
    }) => {
      if (payload.id) {
        return updateResource(
          payload.id,
          payload.data,
        );
      }

      return createResource(
        payload.data,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });

      queryClient.invalidateQueries({
        queryKey: ["stock-monitoring"],
      });

      setShowForm(false);
      setEditingResource(null);
    },
  });

  const deleteMutation =
    useMutation({
      mutationFn: deleteResource,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["resources"],
        });

        queryClient.invalidateQueries({
          queryKey: ["stock-monitoring"],
        });
      },
    });

  const handleDelete = (
    resource: Resource,
  ) => {
    if (
      !window.confirm(
        `Delete resource "${resource.name}"?`,
      )
    ) {
      return;
    }

    deleteMutation.mutate(resource.id);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Resources
          </h2>

          <p className="text-sm text-slate-500">
            Manage the resources tracked by ReliefTrack AI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingResource(null);
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search resources..."
              className="w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <input
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            placeholder="Filter by category"
            className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          />
        </div>
      </section>

      {query.isLoading && (
        <LoadingCard text="Loading resources..." />
      )}

      {query.isError && (
        <ErrorCard text="Unable to load resources." />
      )}

      {!query.isLoading &&
        !query.isError && (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Resource
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Unit
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Minimum Stock
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {resources.map((resource) => (
                    <tr
                      key={resource.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <Package size={18} />
                          </div>

                          <div>
                            <p className="font-medium text-slate-900">
                              {resource.name}
                            </p>

                            {resource.description && (
                              <p className="max-w-xs truncate text-xs text-slate-500">
                                {resource.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {resource.category}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-700">
                        {resource.unit}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {resource.minimum_stock.toLocaleString()}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingResource(
                                resource,
                              );
                              setShowForm(true);
                            }}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            type="button"
                            disabled={
                              deleteMutation.isPending
                            }
                            onClick={() =>
                              handleDelete(
                                resource,
                              )
                            }
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {resources.length === 0 && (
                    <EmptyTable
                      message="No resources found."
                    />
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      {showForm && (
        <ResourceForm
          resource={editingResource}
          isSubmitting={mutation.isPending}
          onClose={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
          onSubmit={(data) =>
            mutation.mutate({
              id: editingResource?.id,
              data,
            })
          }
        />
      )}
    </div>
  );
}

/* =====================================================
   TRANSACTIONS
===================================================== */

function TransactionsTab() {
  const queryClient =
    useQueryClient();

  const [showForm, setShowForm] =
    useState(false);

  const query = useQuery({
    queryKey: [
      "stock-transactions",
    ],
    queryFn: getStockTransactions,
  });

  const warehousesQuery =
    useQuery({
      queryKey: ["warehouses"],
      queryFn: () => getWarehouses(),
    });

  const resourcesQuery =
    useQuery({
      queryKey: ["resources"],
      queryFn: () => getResources(),
    });

  const createMutation =
    useMutation({
      mutationFn:
        createStockTransaction,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "stock-transactions",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "stock-monitoring",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });

        setShowForm(false);
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn:
        deleteStockTransaction,

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            "stock-transactions",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: [
            "stock-monitoring",
          ],
        });

        queryClient.invalidateQueries({
          queryKey: ["dashboard"],
        });
      },
    });

  const transactions =
    query.data ?? [];

  const warehouses =
    warehousesQuery.data ?? [];

  const resources =
    resourcesQuery.data ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Stock Transactions
          </h2>

          <p className="text-sm text-slate-500">
            Record and review stock movements.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Record Transaction
        </button>
      </div>

      {query.isLoading && (
        <LoadingCard text="Loading transactions..." />
      )}

      {query.isError && (
        <ErrorCard text="Unable to load stock transactions." />
      )}

      {!query.isLoading &&
        !query.isError && (
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
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
                      Type
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {transactions.map(
                    (transaction) => {
                      const warehouse =
                        warehouses.find(
                          (item) =>
                            item.id ===
                            transaction.warehouse_id,
                        );

                      const resource =
                        resources.find(
                          (item) =>
                            item.id ===
                            transaction.resource_id,
                        );

                      return (
                        <tr
                          key={
                            transaction.id
                          }
                          className="hover:bg-slate-50"
                        >
                          <td className="px-5 py-4 text-sm text-slate-600">
                            {new Date(
                              transaction.created_at,
                            ).toLocaleString()}
                          </td>

                          <td className="px-5 py-4 text-sm font-medium text-slate-800">
                            {warehouse?.name ??
                              `Warehouse #${transaction.warehouse_id}`}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-700">
                            {resource?.name ??
                              `Resource #${transaction.resource_id}`}
                          </td>

                          <td className="px-5 py-4">
                            <TransactionType
                              type={
                                transaction.transaction_type
                              }
                            />
                          </td>

                          <td className="px-5 py-4 text-sm font-bold text-slate-900">
                            {transaction.quantity.toLocaleString()}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                disabled={
                                  deleteMutation.isPending
                                }
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Delete this stock transaction?",
                                    )
                                  ) {
                                    deleteMutation.mutate(
                                      transaction.id,
                                    );
                                  }
                                }}
                                className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2
                                  size={17}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}

                  {transactions.length ===
                    0 && (
                    <EmptyTable
                      message="No stock transactions found."
                    />
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

      {showForm && (
        <TransactionForm
          warehouses={warehouses}
          resources={resources}
          isSubmitting={
            createMutation.isPending
          }
          onClose={() =>
            setShowForm(false)
          }
          onSubmit={(data) =>
            createMutation.mutate(data)
          }
        />
      )}
    </div>
  );
}

/* =====================================================
   RESOURCE FORM
===================================================== */

function ResourceForm({
  resource,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  resource: Resource | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: ResourcePayload,
  ) => void;
}) {
  const [form, setForm] =
    useState<ResourcePayload>({
      name: resource?.name ?? "",
      category:
        resource?.category ?? "",
      unit: resource?.unit ?? "",
      minimum_stock:
        resource?.minimum_stock ?? 0,
      description:
        resource?.description ?? "",
    });

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,
      minimum_stock: Number(
        form.minimum_stock,
      ),
    });
  };

  return (
    <Modal
      title={
        resource
          ? "Edit Resource"
          : "Add Resource"
      }
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-4"
      >
        <Input
          label="Resource Name"
          value={form.name}
          required
          onChange={(value) =>
            setForm({
              ...form,
              name: value,
            })
          }
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Category"
            value={form.category}
            required
            onChange={(value) =>
              setForm({
                ...form,
                category: value,
              })
            }
          />

          <Input
            label="Unit"
            value={form.unit}
            required
            placeholder="e.g. kg, cartons, pieces"
            onChange={(value) =>
              setForm({
                ...form,
                unit: value,
              })
            }
          />
        </div>

        <Input
          label="Minimum Stock"
          type="number"
          value={String(
            form.minimum_stock,
          )}
          required
          onChange={(value) =>
            setForm({
              ...form,
              minimum_stock: Number(
                value,
              ),
            })
          }
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            value={
              form.description ?? ""
            }
            onChange={(event) =>
              setForm({
                ...form,
                description:
                  event.target.value,
              })
            }
            rows={3}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <ModalActions
          onClose={onClose}
          isSubmitting={isSubmitting}
          submitLabel={
            resource
              ? "Save Changes"
              : "Create Resource"
          }
        />
      </form>
    </Modal>
  );
}

/* =====================================================
   TRANSACTION FORM
===================================================== */

function TransactionForm({
  warehouses,
  resources,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  warehouses: {
    id: number;
    name: string;
  }[];
  resources: Resource[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    data: StockTransactionPayload,
  ) => void;
}) {
  const [form, setForm] =
    useState<StockTransactionPayload>({
      warehouse_id:
        warehouses[0]?.id ?? 0,
      resource_id:
        resources[0]?.id ?? 0,
      transaction_type: "STOCK_IN",
      quantity: 1,
      reference: "",
      notes: "",
    });

  const submit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    onSubmit({
      ...form,
      warehouse_id: Number(
        form.warehouse_id,
      ),
      resource_id: Number(
        form.resource_id,
      ),
      quantity: Number(
        form.quantity,
      ),
    });
  };

  return (
    <Modal
      title="Record Stock Transaction"
      onClose={onClose}
    >
      <form
        onSubmit={submit}
        className="space-y-4"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Warehouse
          </label>

          <select
            value={form.warehouse_id}
            onChange={(event) =>
              setForm({
                ...form,
                warehouse_id:
                  Number(
                    event.target.value,
                  ),
              })
            }
            required
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="">
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
            onChange={(event) =>
              setForm({
                ...form,
                resource_id:
                  Number(
                    event.target.value,
                  ),
              })
            }
            required
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="">
              Select resource
            </option>

            {resources.map(
              (resource) => (
                <option
                  key={resource.id}
                  value={resource.id}
                >
                  {resource.name}
                </option>
              ),
            )}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Transaction Type
            </label>

            <select
              value={
                form.transaction_type
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  transaction_type:
                    event.target.value as TransactionType,
                })
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

              <option value="ADJUSTERMENT">
                Adjustment
              </option>

              <option value="DAMAGED">
                Damaged
              </option>
            </select>
          </div>

          <Input
            label="Quantity"
            type="number"
            min="1"
            value={String(
              form.quantity,
            )}
            required
            onChange={(value) =>
              setForm({
                ...form,
                quantity: Number(
                  value,
                ),
              })
            }
          />
        </div>

        <Input
          label="Reference"
          value={
            form.reference ?? ""
          }
          placeholder="e.g. GRN-001"
          onChange={(value) =>
            setForm({
              ...form,
              reference: value,
            })
          }
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Notes
          </label>

          <textarea
            value={form.notes ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                notes:
                  event.target.value,
              })
            }
            rows={3}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          />
        </div>

        <ModalActions
          onClose={onClose}
          isSubmitting={isSubmitting}
          submitLabel="Record Transaction"
        />
      </form>
    </Modal>
  );
}

/* =====================================================
   SHARED COMPONENTS
===================================================== */

function InventorySummary({
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

function StockStatus({
  status,
}: {
  status: string;
}) {
  const normalized =
    status.toLowerCase();

  const isNormal =
    normalized === "normal";

  const isCritical =
    normalized.includes(
      "critical",
    );

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isNormal
          ? "bg-emerald-50 text-emerald-700"
          : isCritical
            ? "bg-red-50 text-red-700"
            : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {!isNormal && (
        <AlertTriangle size={13} />
      )}

      {status}
    </span>
  );
}

function TransactionType({
  type,
}: {
  type: string;
}) {
  const isIn =
    type.toLowerCase() === "in" ||
    type.toLowerCase() ===
      "received";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isIn
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-700",
      ].join(" ")}
    >
      {isIn ? (
        <ArrowDownToLine size={13} />
      ) : (
        <ArrowUpFromLine size={13} />
      )}

      {type}
    </span>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

function ModalActions({
  onClose,
  isSubmitting,
  submitLabel,
}: {
  onClose: () => void;
  isSubmitting: boolean;
  submitLabel: string;
}) {
  return (
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
        disabled={isSubmitting}
        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : submitLabel}
      </button>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  min,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        min={min}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}

function LoadingCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-10 text-center">
      <p className="text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}

function ErrorCard({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <div className="flex gap-3">
        <AlertTriangle
          className="text-red-600"
          size={20}
        />

        <div>
          <h3 className="font-semibold text-red-800">
            Something went wrong
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyTable({
  message,
}: {
  message: string;
}) {
  return (
    <tr>
      <td
        colSpan={10}
        className="px-5 py-12 text-center"
      >
        <Package
          size={32}
          className="mx-auto text-slate-300"
        />

        <p className="mt-3 font-medium text-slate-700">
          {message}
        </p>
      </td>
    </tr>
  );
}

export default InventoryPage;
