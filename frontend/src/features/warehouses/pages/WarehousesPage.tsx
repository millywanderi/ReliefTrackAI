import { useState } from "react";
import {
  Building2,
  Edit,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createWarehouse,
  deleteWarehouse,
  getWarehouses,
  updateWarehouse,
} from "../api/warehousesApi";

import type {
  Warehouse,
  WarehousePayload,
} from "../types";

function WarehousesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("");
  const [status, setStatus] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<Warehouse | null>(null);

  const query = useQuery({
    queryKey: [
      "warehouses",
      search,
      county,
      status,
    ],
    queryFn: () =>
      getWarehouses({
        search: search || undefined,
        county: county || undefined,
        status: status || undefined,
      }),
  });

  const mutation = useMutation({
    mutationFn: async (payload: {
      id?: number;
      data: WarehousePayload;
    }) => {
      if (payload.id) {
        return updateWarehouse(
          payload.id,
          payload.data,
        );
      }

      return createWarehouse(payload.data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      setShowForm(false);
      setEditingWarehouse(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWarehouse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });
    },
  });

  const warehouses = query.data ?? [];

  const handleDelete = (warehouse: Warehouse) => {
    const confirmed = window.confirm(
      `Delete warehouse "${warehouse.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(warehouse.id);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingWarehouse(null);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Warehouses
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage humanitarian storage facilities and
            warehouse operations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Warehouse
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Warehouses"
          value={warehouses.length}
          icon={<Building2 size={20} />}
        />

        <SummaryCard
          title="Active"
          value={
            warehouses.filter(
              (warehouse) =>
                warehouse.status.toLowerCase() ===
                "active",
            ).length
          }
          icon={<Building2 size={20} />}
        />

        <SummaryCard
          title="Inactive"
          value={
            warehouses.filter(
              (warehouse) =>
                warehouse.status.toLowerCase() !==
                "active",
            ).length
          }
          icon={<Building2 size={20} />}
        />
      </div>

      {/* Filters */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
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
              placeholder="Search warehouses..."
              className="w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <input
            type="text"
            value={county}
            onChange={(event) =>
              setCounty(event.target.value)
            }
            placeholder="Filter by county"
            className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </section>

      {/* Loading */}
      {query.isLoading && (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading warehouses...
          </p>
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load warehouses
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
            <table className="w-full min-w-[850px] text-left">
              <thead className="border-b bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Warehouse
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Capacity
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Manager
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {warehouses.map((warehouse) => (
                  <tr
                    key={warehouse.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                          <Building2 size={19} />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {warehouse.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            ID #{warehouse.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={16}
                          className="mt-0.5 text-slate-400"
                        />

                        <div>
                          <p className="text-sm text-slate-700">
                            {warehouse.county}
                          </p>

                          {warehouse.sub_county && (
                            <p className="text-xs text-slate-500">
                              {warehouse.sub_county}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {warehouse.capacity.toLocaleString()}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {warehouse.manager_name ||
                          "Not assigned"}
                      </p>

                      {warehouse.manager_phone && (
                        <p className="text-xs text-slate-500">
                          {warehouse.manager_phone}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={warehouse.status}
                      />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(warehouse)
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit warehouse"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(warehouse)
                          }
                          disabled={
                            deleteMutation.isPending
                          }
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          title="Delete warehouse"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {warehouses.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center"
                    >
                      <Building2
                        size={32}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-700">
                        No warehouses found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Add a warehouse or change your
                        filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Form Modal */}
      {showForm && (
        <WarehouseForm
          warehouse={editingWarehouse}
          isSubmitting={mutation.isPending}
          onClose={() => {
            setShowForm(false);
            setEditingWarehouse(null);
          }}
          onSubmit={(data) => {
            mutation.mutate({
              id: editingWarehouse?.id,
              data,
            });
          }}
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

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const active =
    status.toLowerCase() === "active";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600",
      ].join(" ")}
    >
      {status}
    </span>
  );
}

interface WarehouseFormProps {
  warehouse: Warehouse | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: WarehousePayload) => void;
}

function WarehouseForm({
  warehouse,
  isSubmitting,
  onClose,
  onSubmit,
}: WarehouseFormProps) {
  const [form, setForm] = useState<WarehousePayload>({
    name: warehouse?.name ?? "",
    county: warehouse?.county ?? "",
    sub_county: warehouse?.sub_county ?? "",
    address: warehouse?.address ?? "",
    latitude: warehouse?.latitude ?? null,
    longitude: warehouse?.longitude ?? null,
    capacity: warehouse?.capacity ?? 0,
    manager_name: warehouse?.manager_name ?? "",
    manager_phone: warehouse?.manager_phone ?? "",
    status: warehouse?.status ?? "Active",
  });

  const updateField = (
    field: keyof WarehousePayload,
    value: string | number | null,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submit = (event: React.FormEvent) => {
  event.preventDefault();

  onSubmit({
    ...form,
    capacity: Number(form.capacity),
    latitude:
      form.latitude === null ||
      form.latitude === undefined
        ? undefined
        : Number(form.latitude),
    longitude:
      form.longitude === null ||
      form.longitude === undefined
        ? undefined
        : Number(form.longitude),
  });
};

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {warehouse
                ? "Edit Warehouse"
                : "Add Warehouse"}
            </h2>

            <p className="text-sm text-slate-500">
              Enter the warehouse information below.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={submit}
          className="space-y-5 p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Warehouse Name"
              value={form.name}
              required
              onChange={(value) =>
                updateField("name", value)
              }
            />

            <FormField
              label="County"
              value={form.county}
              required
              onChange={(value) =>
                updateField("county", value)
              }
            />

            <FormField
              label="Sub-county"
              value={form.sub_county ?? ""}
              onChange={(value) =>
                updateField("sub_county", value)
              }
            />

            <FormField
              label="Address"
              value={form.address ?? ""}
              onChange={(value) =>
                updateField("address", value)
              }
            />

            <FormField
              label="Capacity"
              type="number"
              value={String(form.capacity)}
              required
              onChange={(value) =>
                updateField(
                  "capacity",
                  Number(value),
                )
              }
            />

            <FormField
              label="Manager Name"
              value={form.manager_name ?? ""}
              onChange={(value) =>
                updateField("manager_name", value)
              }
            />

            <FormField
              label="Manager Phone"
              value={form.manager_phone ?? ""}
              onChange={(value) =>
                updateField("manager_phone", value)
              }
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value,
                  )
                }
                className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>

            <FormField
              label="Latitude"
              type="number"
              value={
                form.latitude === null
                  ? ""
                  : String(form.latitude)
              }
              onChange={(value) =>
                updateField(
                  "latitude",
                  value === ""
                    ? null
                    : Number(value),
                )
              }
            />

            <FormField
              label="Longitude"
              type="number"
              value={
                form.longitude === null
                  ? ""
                  : String(form.longitude)
              }
              onChange={(value) =>
                updateField(
                  "longitude",
                  value === ""
                    ? null
                    : Number(value),
                )
              }
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
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : warehouse
                  ? "Save Changes"
                  : "Create Warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}

export default WarehousesPage;
