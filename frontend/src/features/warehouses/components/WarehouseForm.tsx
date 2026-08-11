import { useState } from "react";

import type { WarehouseCreate } from "../types";

interface WarehouseFormProps {
  initialData?: Partial<WarehouseCreate>;
  onSubmit: (data: WarehouseCreate) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const defaultForm: WarehouseCreate = {
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
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: WarehouseFormProps) {
  const [form, setForm] = useState<WarehouseCreate>({
    ...defaultForm,
    ...initialData,
  });

  const handleChange = (
    field: keyof WarehouseCreate,
    value: string | number | undefined,
  ) => {
    setForm((current: WarehouseCreate) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      ...form,
      latitude:
        form.latitude === undefined ||
        Number.isNaN(form.latitude)
          ? undefined
          : Number(form.latitude),
      longitude:
        form.longitude === undefined ||
        Number.isNaN(form.longitude)
          ? undefined
          : Number(form.longitude),
      capacity: Number(form.capacity),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Warehouse Name
          </label>

          <input
            type="text"
            value={form.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Main Relief Warehouse"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            County
          </label>

          <input
            type="text"
            value={form.county}
            onChange={(event) =>
              handleChange("county", event.target.value)
            }
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Nairobi"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Sub County
          </label>

          <input
            type="text"
            value={form.sub_county ?? ""}
            onChange={(event) =>
              handleChange("sub_county", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Address
          </label>

          <input
            type="text"
            value={form.address ?? ""}
            onChange={(event) =>
              handleChange("address", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Capacity
          </label>

          <input
            type="number"
            min="0"
            value={form.capacity}
            onChange={(event) =>
              handleChange(
                "capacity",
                Number(event.target.value),
              )
            }
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>

          <select
            value={form.status ?? "Active"}
            onChange={(event) =>
              handleChange("status", event.target.value)
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Manager Name
          </label>

          <input
            type="text"
            value={form.manager_name ?? ""}
            onChange={(event) =>
              handleChange(
                "manager_name",
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Manager Phone
          </label>

          <input
            type="tel"
            value={form.manager_phone ?? ""}
            onChange={(event) =>
              handleChange(
                "manager_phone",
                event.target.value,
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            value={form.latitude ?? ""}
            onChange={(event) =>
              handleChange(
                "latitude",
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            value={form.longitude ?? ""}
            onChange={(event) =>
              handleChange(
                "longitude",
                event.target.value === ""
                  ? undefined
                  : Number(event.target.value),
              )
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Warehouse"}
        </button>
      </div>
    </form>
  );
}

export default WarehouseForm;
