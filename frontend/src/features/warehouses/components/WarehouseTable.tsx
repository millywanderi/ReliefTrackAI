import {
  Eye,
  Pencil,
  Trash2,
  Warehouse as WarehouseIcon,
} from "lucide-react";

import type { Warehouse } from "../types";

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onView: (warehouse: Warehouse) => void;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (warehouse: Warehouse) => void;
}

function WarehouseTable({
  warehouses,
  onView,
  onEdit,
  onDelete,
}: WarehouseTableProps) {
  if (warehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <WarehouseIcon size={25} />
        </div>

        <h3 className="mt-4 font-semibold text-slate-900">
          No warehouses found
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          No warehouses match your current search or
          filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="border-b bg-slate-50 text-left">
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Warehouse
            </th>

            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Location
            </th>

            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Capacity
            </th>

            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Manager
            </th>

            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {warehouses.map((warehouse) => (
            <tr
              key={warehouse.id}
              className="transition hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <WarehouseIcon size={17} />
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
                <p className="text-sm text-slate-700">
                  {warehouse.county}
                </p>

                {warehouse.sub_county && (
                  <p className="text-xs text-slate-500">
                    {warehouse.sub_county}
                  </p>
                )}
              </td>

              <td className="px-5 py-4">
                <span className="text-sm font-medium text-slate-900">
                  {warehouse.capacity.toLocaleString()}
                </span>

                <span className="ml-1 text-xs text-slate-500">
                  units
                </span>
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
                <div className="flex justify-end gap-1">
                  <ActionButton
                    label="View"
                    onClick={() => onView(warehouse)}
                  >
                    <Eye size={16} />
                  </ActionButton>

                  <ActionButton
                    label="Edit"
                    onClick={() => onEdit(warehouse)}
                  >
                    <Pencil size={16} />
                  </ActionButton>

                  <ActionButton
                    label="Delete"
                    danger
                    onClick={() => onDelete(warehouse)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const normalized = status.toLowerCase();

  const classes =
    normalized === "active"
      ? "bg-emerald-50 text-emerald-700"
      : normalized === "maintenance"
        ? "bg-amber-50 text-amber-700"
        : "bg-slate-100 text-slate-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

interface ActionButtonProps {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}

function ActionButton({
  label,
  children,
  onClick,
  danger = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={[
        "rounded-lg p-2 transition",
        danger
          ? "text-red-500 hover:bg-red-50 hover:text-red-700"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default WarehouseTable;
