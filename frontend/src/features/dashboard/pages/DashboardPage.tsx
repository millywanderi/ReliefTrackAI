import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

  const overviewData = data
    ? [
        {
          name: "Beneficiaries",
          value: data.beneficiaries,
        },
        {
          name: "Households",
          value: data.households,
        },
        {
          name: "Warehouses",
          value: data.warehouses,
        },
        {
          name: "Resources",
          value: data.resources,
        },
        {
          name: "Distributions",
          value: data.distribution_events,
        },
      ]
    : [];

  if (isLoading) {
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
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border bg-white"
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl border bg-white" />

          <div className="h-96 animate-pulse rounded-xl border bg-white" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
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

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h3 className="font-semibold text-red-800">
            Unable to load dashboard
          </h3>

          <p className="mt-2 text-sm text-red-700">
            We could not retrieve the latest operational statistics.
            Please check your connection and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Overview of humanitarian operations and resources.
        </p>
      </div>

      {/* Primary Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Beneficiaries"
          value={data.beneficiaries}
          description="Registered beneficiaries"
        />

        <StatCard
          title="Warehouses"
          value={data.warehouses}
          description="Active warehouses"
        />

        <StatCard
          title="Resources"
          value={data.resources}
          description="Tracked resources"
        />

        <StatCard
          title="Distributions"
          value={data.distribution_events}
          description="Distribution events"
        />
      </div>

      {/* Secondary Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Households"
          value={data.households}
          description="Registered households"
        />

        <StatCard
          title="Resources Distributed"
          value={data.resources_distributed}
          description="Delivered resource quantity"
        />

        <StatCard
          title="Low Stock Alerts"
          value={data.low_stock_alerts}
          description="Resources requiring attention"
        />

        <StatCard
          title="Critical Beneficiaries"
          value={data.critical_beneficiaries}
          description="Critical vulnerability priority"
        />
      </div>

      {/* Charts and Alerts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Operations Chart */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h3 className="font-semibold text-slate-900">
              Operations Overview
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Current humanitarian operations across the platform.
            </p>
          </div>

          <div className="mt-6 h-72">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={overviewData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  name="Total"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Operational Alerts */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <div>
            <h3 className="font-semibold text-slate-900">
              Operational Alerts
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Areas requiring attention.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <AlertCard
              title="Low Stock Alerts"
              value={data.low_stock_alerts}
              description="Resources requiring attention"
            />

            <AlertCard
              title="Critical Beneficiaries"
              value={data.critical_beneficiaries}
              description="Beneficiaries with critical priority"
            />

            <AlertCard
              title="Resources Distributed"
              value={data.resources_distributed}
              description="Total delivered quantity"
            />
          </div>
        </section>
      </div>

      {/* Operational Summary */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-semibold text-slate-900">
            Operational Summary
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Current status of key humanitarian operations.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryItem
            label="Beneficiaries"
            value={data.beneficiaries}
          />

          <SummaryItem
            label="Households"
            value={data.households}
          />

          <SummaryItem
            label="Warehouses"
            value={data.warehouses}
          />

          <SummaryItem
            label="Resources"
            value={data.resources}
          />
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
}

function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

interface AlertCardProps {
  title: string;
  value: number;
  description: string;
}

function AlertCard({
  title,
  value,
  description,
}: AlertCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border p-4">
      <div>
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <p className="text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: number;
}

function SummaryItem({
  label,
  value,
}: SummaryItemProps) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export default DashboardPage;
