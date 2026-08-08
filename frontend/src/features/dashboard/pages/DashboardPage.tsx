import { useQuery } from "@tanstack/react-query";

import { getDashboard } from "../api/dashboardApi";

function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of humanitarian operations and resources.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border bg-white"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load dashboard
          </h3>

          <p className="mt-2 text-sm text-red-700">
            We could not retrieve the latest operational statistics.
            Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of humanitarian operations and resources.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Beneficiaries"
          value={data.beneficiaries.toLocaleString()}
          description="Registered beneficiaries"
        />

        <StatCard
          title="Warehouses"
          value={data.warehouses.toLocaleString()}
          description="Active warehouses"
        />

        <StatCard
          title="Resources"
          value={data.resources.toLocaleString()}
          description="Tracked resources"
        />

        <StatCard
          title="Distributions"
          value={data.distribution_events.toLocaleString()}
          description="Distribution events"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Households"
          value={data.households.toLocaleString()}
          description="Registered households"
        />

        <StatCard
          title="Resources Distributed"
          value={data.resources_distributed.toLocaleString()}
          description="Delivered resource quantity"
        />

        <StatCard
          title="Low Stock Alerts"
          value={data.low_stock_alerts.toLocaleString()}
          description="Resources requiring attention"
        />

        <StatCard
          title="Critical Beneficiaries"
          value={data.critical_beneficiaries.toLocaleString()}
          description="Critical vulnerability priority"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Operational Overview
          </h3>

          <div className="mt-4 space-y-4">
            <MetricRow
              label="Registered beneficiaries"
              value={data.beneficiaries}
            />

            <MetricRow
              label="Households"
              value={data.households}
            />

            <MetricRow
              label="Distribution events"
              value={data.distribution_events}
            />

            <MetricRow
              label="Resources distributed"
              value={data.resources_distributed}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Operational Alerts
          </h3>

          <div className="mt-4 space-y-3">
            <AlertRow
              label="Low stock alerts"
              value={data.low_stock_alerts}
            />

            <AlertRow
              label="Critical beneficiaries"
              value={data.critical_beneficiaries}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

interface MetricRowProps {
  label: string;
  value: number;
}

function MetricRow({ label, value }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

interface AlertRowProps {
  label: string;
  value: number;
}

function AlertRow({ label, value }: AlertRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span className="font-semibold text-slate-900">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

export default DashboardPage;
