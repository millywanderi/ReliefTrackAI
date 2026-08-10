import { useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Search,
  Warehouse as WarehouseIcon,
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
  WarehouseCreate,
} from "../types";

import WarehouseForm from "../components/WarehouseForm";
import WarehouseTable from "../components/WarehouseTable";
import WarehouseDetails from "../components/WarehouseDetails";

const PAGE_SIZE = 20;

function WarehousesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] =
    useState<Warehouse | null>(null);

  const [viewingWarehouse, setViewingWarehouse] =
    useState<Warehouse | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const {
    data: warehouses = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "warehouses",
      search,
      county,
      status,
      page,
    ],
    queryFn: () =>
      getWarehouses({
        search,
        county,
        status,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const createMutation = useMutation({
    mutationFn: createWarehouse,

    onSuccess: () => {
      setFormOpen(false);
      setErrorMessage(null);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });
    },

    onError: () => {
      setErrorMessage(
        "Unable to create the warehouse. Please check the information and try again.",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: WarehouseCreate;
    }) => updateWarehouse(id, data),

    onSuccess: () => {
      setFormOpen(false);
      setEditingWarehouse(null);
      setErrorMessage(null);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });
    },

    onError: () => {
      setErrorMessage(
        "Unable to update the warehouse. Please try again.",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWarehouse,

    onSuccess: () => {
      setErrorMessage(null);

      queryClient.invalidateQueries({
        queryKey: ["warehouses"],
      });

      if (
        warehouses.length === 1 &&
        page > 1
      ) {
        setPage((current) => current - 1);
      }
    },

    onError: () => {
      setErrorMessage(
        "Unable to delete the warehouse. Please try again.",
      );
    },
  });

  function openCreateForm() {
    setEditingWarehouse(null);
    setErrorMessage(null);
    setFormOpen(true);
  }

  function openEditForm(warehouse: Warehouse) {
    setViewingWarehouse(null);
    setEditingWarehouse(warehouse);
    setErrorMessage(null);
    setFormOpen(true);
  }

  async function handleFormSubmit(
    data: WarehouseCreate,
  ) {
    if (editingWarehouse) {
      await updateMutation.mutateAsync({
        id: editingWarehouse.id,
        data,
      });

      return;
    }

    await createMutation.mutateAsync(data);
  }

  function handleDelete(warehouse: Warehouse) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${warehouse.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(warehouse.id);
  }

  function clearFilters() {
    setSearch("");
    setCounty("");
    setStatus("");
    setPage(1);
  }

  const hasNextPage =
    warehouses.length === PAGE_SIZE;

  const hasPreviousPage = page > 1;

  const isSaving =
    createMutation.isPending ||
    updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <WarehouseIcon size={19} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Warehouses
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage humanitarian storage facilities and
                warehouse capacity.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Warehouse
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              Something went wrong
            </p>

            <p className="mt-1 text-sm text-red-700">
              {errorMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-medium text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filters */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search warehouses..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>

          <input
            type="text"
            value={county}
            onChange={(event) => {
              setCounty(event.target.value);
              setPage(1);
            }}
            placeholder="County"
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          >
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Maintenance">
              Maintenance
            </option>
          </select>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </section>

      {/* Main Table */}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Warehouse List
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {isLoading
                ? "Loading warehouses..."
                : `${warehouses.length} warehouse${warehouses.length === 1 ? "" : "s"} shown`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            title="Refresh"
            aria-label="Refresh warehouses"
          >
            <RefreshCw
              size={17}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </div>

        {isLoading ? (
          <WarehouseTableSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertCircle size={22} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Unable to load warehouses
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              We could not retrieve the warehouse
              information. Please check your connection
              and try again.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <WarehouseTable
            warehouses={warehouses}
            onView={setViewingWarehouse}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-5 py-4">
          <p className="text-xs text-slate-500">
            Page {page}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasPreviousPage}
              onClick={() =>
                setPage((current) =>
                  Math.max(1, current - 1),
                )
              }
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={!hasNextPage}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Form Modal */}
      {formOpen && (
        <WarehouseForm
          warehouse={editingWarehouse}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormOpen(false);
            setEditingWarehouse(null);
          }}
          isSubmitting={isSaving}
        />
      )}

      {/* Details Modal */}
      {viewingWarehouse && (
        <WarehouseDetails
          warehouse={viewingWarehouse}
          onClose={() =>
            setViewingWarehouse(null)
          }
        />
      )}
    </div>
  );
}

function WarehouseTableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="h-16 animate-pulse rounded-xl bg-slate-100"
        />
      ))}
    </div>
  );
}

export default WarehousesPage;
