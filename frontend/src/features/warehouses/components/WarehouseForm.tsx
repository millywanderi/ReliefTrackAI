import { useEffect, useState } from "react";
import {
  X,
  Save,
  Warehouse as WarehouseIcon,
} from "lucide-react";

import type {
  Warehouse,
  WarehouseCreate,
} from "../types";

interface WarehouseFormProps {
  warehouse?: Warehouse | null;
  onSubmit: (data: WarehouseCreate) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const initialForm: WarehouseCreate = {
  name: "",
  county: "",
  sub_county: "",
  address: "",
  latitude: undefined,
  longitude: undefined,
  capacity: 0,
  manager_name: "",
  manager_phone: "",
  status: "Active",
};

function WarehouseForm({
  warehouse,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: WarehouseFormProps) {
  const [form, setForm] =
    useState<WarehouseCreate>(initialForm);

  useEffect(() => {
    if (warehouse) {
      setForm({
        name: warehouse.name,
        county: warehouse.county,
        sub_county: warehouse.sub_county ?? "",
        address: warehouse.address ?? "",
        latitude: warehouse.latitude ?? undefined,
        longitude: warehouse.longitude ?? undefined,
        capacity: warehouse.capacity,
        manager_name: warehouse.manager_name ?? "",
        manager_phone: warehouse.manager_phone ?? "",
        status: warehouse.status,
      });
    } else {
      setForm(initialForm);
    }
  }, [warehouse]);

  function updateField(
    field: keyof WarehouseCreate,
    value: string | number | undefined,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    await onSubmit({
      ...form,
      capacity: Number(form.capacity),
      latitude:
        form.latitude === undefined ||
        form.latitude === null ||
        form.latitude === ("" as never)
          ? undefined
          : Number(form.latitude),
      longitude:
        form.longitude === undefined ||
        form.longitude === null ||
        form.longitude === ("" as never)
          ? undefined
          : Number(form.longitude),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <WarehouseIcon size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {warehouse
                  ? "Edit Warehouse"
                  : "Add Warehouse"}
              </h2>

              <p className="text-sm text-slate-500">
                {warehouse
                  ? "Update warehouse information."
                  : "Register a new warehouse."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Warehouse Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Warehouse Name"
                required
                value={form.name}
                onChange={(value) =>
                  updateField("name", value)
                }
              />

              <Field
                label="County"
                required
                value={form.county}
                onChange={(value) =>
                  updateField("county", value)
                }
              />

              <Field
                label="Sub-county"
                value={form.sub_county ?? ""}
                onChange={(value) =>
                  updateField("sub_county", value)
                }
              />

              <Field
                label="Address"
                value={form.address ?? ""}
                onChange={(value) =>
                  updateField("address", value)
                }
              />

              <Field
                label="Capacity"
                required
                type="number"
                min="0"
                value={form.capacity}
                onChange={(value) =>
                  updateField("capacity", Number(value))
                }
              />

              <SelectField
                label="Status"
                value={form.status}
                onChange={(value) =>
                  updateField("status", value)
                }
                options={[
                  "Active",
                  "Inactive",
                  "Maintenance",
                ]}
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Location
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Latitude"
                type="number"
                step="any"
                value={form.latitude ?? ""}
                onChange={(value) =>
                  updateField(
                    "latitude",
                    value === ""
                      ? undefined
                      : Number(value),
                  )
                }
              />

              <Field
                label="Longitude"
                type="number"
                step="any"
                value={form.longitude ?? ""}
                onChange={(value) =>
                  updateField(
                    "longitude",
                    value === ""
                      ? undefined
                      : Number(value),
                  )
                }
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-900">
              Warehouse Manager
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Manager Name"
                value={form.manager_name ?? ""}
                onChange={(value) =>
                  updateField("manager_name", value)
                }
              />

              <Field
                label="Manager Phone"
                value={form.manager_phone ?? ""}
                onChange={(value) =>
                  updateField("manager_phone", value)
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-xl border px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !form.name.trim() ||
                !form.county.trim() ||
                form.capacity < 0
              }
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {isSubmitting
                ? "Saving..."
                : warehouse
                  ? "Save Changes"
                  : "Add Warehouse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  min?: string;
  step?: string;
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  min,
  step,
}: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </span>

      <input
        type={type}
        min={min}
        step={step}
        value={value}
        required={required}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </label>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default WarehouseForm;
