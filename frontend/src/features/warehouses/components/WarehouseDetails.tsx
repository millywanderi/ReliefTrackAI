import {
  MapPin,
  Phone,
  User,
  Warehouse as WarehouseIcon,
  X,
} from "lucide-react";

import type { ReactNode } from "react";

import type { Warehouse } from "../types";

interface WarehouseDetailsProps {
  warehouse: Warehouse;
  onClose: () => void;
}

function WarehouseDetails({
  warehouse,
  onClose,
}: WarehouseDetailsProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <WarehouseIcon size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Warehouse Details
              </h2>

              <p className="text-sm text-slate-500">
                {warehouse.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2">
          <Detail
            label="Warehouse"
            value={warehouse.name}
          />

          <Detail
            label="Status"
            value={warehouse.status}
          />

          <Detail
            label="County"
            value={warehouse.county}
          />

          <Detail
            label="Sub-county"
            value={warehouse.sub_county ?? null}
          />

          <Detail
            label="Address"
            value={warehouse.address ?? null}
            icon={<MapPin size={16} />}
          />

          <Detail
            label="Capacity"
            value={`${warehouse.capacity.toLocaleString()} units`}
          />

          <Detail
            label="Manager"
            value={warehouse.manager_name ?? null}
            icon={<User size={16} />}
          />

          <Detail
            label="Manager Phone"
            value={warehouse.manager_phone ?? null}
            icon={<Phone size={16} />}
          />

          <Detail
            label="Latitude"
            value={
              warehouse.latitude != null
                ? String(warehouse.latitude)
                : null
            }
          />

          <Detail
            label="Longitude"
            value={
              warehouse.longitude != null
                ? String(warehouse.longitude)
                : null
            }
          />

          <Detail
            label="Created"
            value={new Date(
              warehouse.created_at,
            ).toLocaleDateString()}
          />
        </div>

        <div className="border-t bg-slate-50 px-6 py-4 text-right">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface DetailProps {
  label: string;
  value?: string | null;
  icon?: ReactNode;
}

function Detail({
  label,
  value,
  icon,
}: DetailProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-center gap-2">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <p className="text-sm font-medium text-slate-900">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default WarehouseDetails;
