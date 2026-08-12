import { useState } from "react";
import {
  Edit,
  FileText,
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
  deleteResource,
  getResources,
  updateResource,
} from "../api/resourcesApi";

import type {
  Resource,
  ResourcePayload,
} from "../types";

function ResourcesPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] =
    useState<Resource | null>(null);

  const query = useQuery({
    queryKey: ["resources", search, category],
    queryFn: () =>
      getResources({
        search: search || undefined,
        category: category || undefined,
      }),
  });

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

      return createResource(payload.data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });

      setShowForm(false);
      setEditingResource(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResource,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources"],
      });
    },
  });

  const resources = query.data ?? [];

  const categories = Array.from(
    new Set(
      resources
        .map((resource) => resource.category)
        .filter(Boolean),
    ),
  ).sort();

  const handleCreate = () => {
    setEditingResource(null);
    setShowForm(true);
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setShowForm(true);
  };

  const handleDelete = (resource: Resource) => {
    const confirmed = window.confirm(
      `Delete resource "${resource.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(resource.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Resource Inventory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage humanitarian resources, units, categories,
            and minimum stock requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Resource
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Resources"
          value={resources.length}
          icon={<Package size={20} />}
        />

        <SummaryCard
          title="Categories"
          value={categories.length}
          icon={<FileText size={20} />}
        />

        <SummaryCard
          title="Minimum Stock Items"
          value={
            resources.filter(
              (resource) => resource.minimum_stock > 0,
            ).length
          }
          icon={<Package size={20} />}
        />
      </div>

      {/* Filters */}
      <section className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-2">
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
              placeholder="Search resources..."
              className="w-full rounded-xl border px-10 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
          >
            <option value="">All categories</option>

            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Loading */}
      {query.isLoading && (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Loading resources...
          </p>
        </div>
      )}

      {/* Error */}
      {query.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load resources
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

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Description
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
                          <Package size={19} />
                        </div>

                        <div>
                          <p className="font-medium text-slate-900">
                            {resource.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            ID #{resource.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {resource.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {resource.unit}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-900">
                        {resource.minimum_stock.toLocaleString()}
                      </span>

                      <span className="ml-1 text-xs text-slate-500">
                        {resource.unit}
                      </span>
                    </td>

                    <td className="max-w-xs px-5 py-4">
                      <p className="truncate text-sm text-slate-600">
                        {resource.description ||
                          "No description"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(resource)
                          }
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                          title="Edit resource"
                        >
                          <Edit size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(resource)
                          }
                          disabled={
                            deleteMutation.isPending
                          }
                          className="rounded-lg p-2 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          title="Delete resource"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {resources.length === 0 && (
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
                        No resources found
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Add a resource or change your filters.
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
        <ResourceForm
          resource={editingResource}
          isSubmitting={mutation.isPending}
          onClose={() => {
            setShowForm(false);
            setEditingResource(null);
          }}
          onSubmit={(data) => {
            mutation.mutate({
              id: editingResource?.id,
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

interface ResourceFormProps {
  resource: Resource | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: ResourcePayload) => void;
}

function ResourceForm({
  resource,
  isSubmitting,
  onClose,
  onSubmit,
}: ResourceFormProps) {
  const [form, setForm] = useState<ResourcePayload>({
    name: resource?.name ?? "",
    category: resource?.category ?? "",
    unit: resource?.unit ?? "",
    minimum_stock: resource?.minimum_stock ?? 0,
    description: resource?.description ?? "",
  });

  const updateField = (
    field: keyof ResourcePayload,
    value: string | number,
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
      minimum_stock: Number(form.minimum_stock),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {resource
                ? "Edit Resource"
                : "Add Resource"}
            </h2>

            <p className="text-sm text-slate-500">
              Enter the resource information below.
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
            <FormField
              label="Resource Name"
              value={form.name}
              required
              onChange={(value) =>
                updateField("name", value)
              }
            />

            <FormField
              label="Category"
              value={form.category}
              required
              onChange={(value) =>
                updateField("category", value)
              }
            />

            <FormField
              label="Unit"
              value={form.unit}
              required
              onChange={(value) =>
                updateField("unit", value)
              }
            />

            <FormField
              label="Minimum Stock"
              type="number"
              value={String(form.minimum_stock ?? 0)}
              required
              onChange={(value) =>
                updateField(
                  "minimum_stock",
                  Number(value),
                )
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Description
            </label>

            <textarea
              value={form.description ?? ""}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Describe the resource..."
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
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : resource
                  ? "Save Changes"
                  : "Create Resource"}
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
        min={type === "number" ? 0 : undefined}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-slate-400"
      />
    </div>
  );
}

export default ResourcesPage;
