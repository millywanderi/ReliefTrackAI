import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Home,
  Package,
  Sparkles,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="space-y-6">
        <PageHeader />

        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />

            <div>
              <h3 className="font-semibold text-red-800">
                Unable to load dashboard
              </h3>

              <p className="mt-2 text-sm text-red-700">
                We could not retrieve the latest operational statistics.
                Please check your connection and try again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const overviewData = [
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
  ];

  const hasAlerts =
    data.low_stock_alerts > 0 ||
    data.critical_beneficiaries > 0;

  return (
    <div className="space-y-6">
      <PageHeader />

      {/* Primary operational statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Beneficiaries"
          value={data.beneficiaries}
          description="Registered beneficiaries"
          icon={Users}
        />

        <StatCard
          title="Households"
          value={data.households}
          description="Registered households"
          icon={Home}
        />

        <StatCard
          title="Warehouses"
          value={data.warehouses}
          description="Active warehouses"
          icon={Warehouse}
        />

        <StatCard
          title="Resources"
          value={data.resources}
          description="Tracked resources"
          icon={Boxes}
        />
      </div>

      {/* Secondary operational statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Distribution Events"
          value={data.distribution_events}
          description="Recorded distribution events"
          icon={Truck}
        />

        <StatCard
          title="Resources Distributed"
          value={data.resources_distributed}
          description="Total delivered quantity"
          icon={Package}
        />

        <StatCard
          title="Low Stock Alerts"
          value={data.low_stock_alerts}
          description="Resources requiring attention"
          icon={AlertTriangle}
          alert={data.low_stock_alerts > 0}
        />

        <StatCard
          title="Critical Beneficiaries"
          value={data.critical_beneficiaries}
          description="Critical vulnerability priority"
          icon={HeartPulse}
          alert={data.critical_beneficiaries > 0}
        />
      </div>

      {/* Main dashboard content */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Operations overview */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <SectionHeader
            icon={BarChart3}
            title="Operations Overview"
            description="Current humanitarian operations across the platform."
          />

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
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
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={55}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) =>
                    Number(value).toLocaleString()
                  }
                />

                <Bar
                  dataKey="value"
                  name="Total"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Resource inventory summary */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <SectionHeader
            icon={Package}
            title="Resource Inventory Summary"
            description="Current resource availability and stock alerts."
          />

          <div className="mt-6 space-y-4">
            <InventoryItem
              label="Tracked Resources"
              value={data.resources}
              icon={Boxes}
            />

            <InventoryItem
              label="Resources Distributed"
              value={data.resources_distributed}
              icon={Package}
            />

            <InventoryItem
              label="Low Stock Alerts"
              value={data.low_stock_alerts}
              icon={AlertTriangle}
              alert={data.low_stock_alerts > 0}
            />

            <div className="rounded-lg bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">
                    Inventory Status
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {data.low_stock_alerts > 0
                      ? "Some resources require attention."
                      : "No current low-stock alerts."}
                  </p>
                </div>

                {data.low_stock_alerts > 0 ? (
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Distribution and beneficiary summary */}
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <SectionHeader
            icon={Truck}
            title="Distribution Summary"
            description="Overview of humanitarian resource distribution."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SummaryItem
              label="Distribution Events"
              value={data.distribution_events}
            />

            <SummaryItem
              label="Resources Distributed"
              value={data.resources_distributed}
            />

            <SummaryItem
              label="Warehouses"
              value={data.warehouses}
            />
          </div>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <SectionHeader
            icon={Users}
            title="Beneficiary Statistics"
            description="Current beneficiary and vulnerability overview."
          />

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <SummaryItem
              label="Beneficiaries"
              value={data.beneficiaries}
            />

            <SummaryItem
              label="Households"
              value={data.households}
            />

            <SummaryItem
              label="Critical"
              value={data.critical_beneficiaries}
              alert={data.critical_beneficiaries > 0}
            />
          </div>
        </section>
      </div>

      {/* Recent activity and AI insights */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Recent Activity */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <SectionHeader
            icon={ClipboardList}
            title="Recent Activity"
            description="Latest operational activity across ReliefTrack AI."
          />

          <div className="mt-6 space-y-4">
            <ActivityItem
              icon={Users}
              title={`${data.beneficiaries.toLocaleString()} beneficiaries registered`}
              description="Beneficiary records currently available in the system."
            />

            <ActivityItem
              icon={Warehouse}
              title={`${data.warehouses.toLocaleString()} warehouses tracked`}
              description="Warehousing infrastructure currently registered."
            />

            <ActivityItem
              icon={Truck}
              title={`${data.distribution_events.toLocaleString()} distribution events`}
              description="Distribution operations recorded in the system."
            />

            <ActivityItem
              icon={Package}
              title={`${data.resources_distributed.toLocaleString()} resources distributed`}
              description="Total quantity recorded as delivered."
            />
          </div>
        </section>

        {/* AI Insights */}
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <SectionHeader
            icon={Sparkles}
            title="AI Insights"
            description="Operational insights based on current platform data."
          />

          <div className="mt-6 space-y-4">
            {hasAlerts ? (
              <>
                {data.low_stock_alerts > 0 && (
                  <InsightItem
                    type="warning"
                    title="Inventory attention required"
                    description={`There are ${data.low_stock_alerts.toLocaleString()} low-stock alert${
                      data.low_stock_alerts === 1 ? "" : "s"
                    } requiring operational review.`}
                  />
                )}

                {data.critical_beneficiaries > 0 && (
                  <InsightItem
                    type="critical"
                    title="Critical beneficiaries identified"
                    description={`${data.critical_beneficiaries.toLocaleString()} beneficiary record${
                      data.critical_beneficiaries === 1 ? "" : "s"
                    } currently have a critical vulnerability priority.`}
                  />
                )}
              </>
            ) : (
              <InsightItem
                type="success"
                title="No critical operational alerts"
                description="Current dashboard indicators do not show low-stock or critical beneficiary alerts."
              />
            )}

            <div className="rounded-lg border border-dashed bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-5 w-5 text-slate-500" />

                <div>
                  <p className="font-medium text-slate-900">
                    AI reporting integration
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Detailed AI-generated operational reports will be
                    available here as the AI reporting module is
                    connected to the dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page Header                                                                 */
/* -------------------------------------------------------------------------- */

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Dashboard
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        Overview of humanitarian operations, beneficiaries, resources,
        and distributions.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section Header                                                              */
/* -------------------------------------------------------------------------- */

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-700" />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Statistics Card                                                             */
/* -------------------------------------------------------------------------- */

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  alert?: boolean;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  alert = false,
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border bg-white p-5 shadow-sm ${
        alert ? "border-amber-200" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value.toLocaleString()}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            alert ? "bg-amber-100" : "bg-slate-100"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              alert ? "text-amber-600" : "text-slate-700"
            }`}
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Inventory Item                                                              */
/* -------------------------------------------------------------------------- */

interface InventoryItemProps {
  label: string;
  value: number;
  icon: React.ElementType;
  alert?: boolean;
}

function InventoryItem({
  label,
  value,
  icon: Icon,
  alert = false,
}: InventoryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            alert ? "bg-amber-100" : "bg-slate-100"
          }`}
        >
          <Icon
            className={`h-4 w-4 ${
              alert ? "text-amber-600" : "text-slate-600"
            }`}
          />
        </div>

        <span className="text-sm font-medium text-slate-700">
          {label}
        </span>
      </div>

      <span className="text-lg font-bold text-slate-900">
        {value.toLocaleString()}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary Item                                                                */
/* -------------------------------------------------------------------------- */

interface SummaryItemProps {
  label: string;
  value: number;
  alert?: boolean;
}

function SummaryItem({
  label,
  value,
  alert = false,
}: SummaryItemProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        alert ? "border-red-200 bg-red-50" : ""
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p
        className={`mt-2 text-2xl font-bold ${
          alert ? "text-red-700" : "text-slate-900"
        }`}
      >
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Activity Item                                                               */
/* -------------------------------------------------------------------------- */

interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

function ActivityItem({
  icon: Icon,
  title,
  description,
}: ActivityItemProps) {
  return (
    <div className="flex gap-3 rounded-lg border p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-600" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* AI Insight                                                                  */
/* -------------------------------------------------------------------------- */

interface InsightItemProps {
  type: "warning" | "critical" | "success";
  title: string;
  description: string;
}

function InsightItem({
  type,
  title,
  description,
}: InsightItemProps) {
  const styles = {
    warning: {
      wrapper: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100 text-amber-600",
      Icon: AlertTriangle,
    },
    critical: {
      wrapper: "border-red-200 bg-red-50",
      icon: "bg-red-100 text-red-600",
      Icon: HeartPulse,
    },
    success: {
      wrapper: "border-green-200 bg-green-50",
      icon: "bg-green-100 text-green-600",
      Icon: CheckCircle2,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div className={`rounded-lg border p-4 ${style.wrapper}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${style.icon}`}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-sm leading-5 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Dashboard Loading State                                                     */
/* -------------------------------------------------------------------------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl border bg-white"
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[5, 6, 7, 8].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-xl border bg-white"
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-96 animate-pulse rounded-xl border bg-white" />

        <div className="h-96 animate-pulse rounded-xl border bg-white" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-48 animate-pulse rounded-xl border bg-white" />

        <div className="h-48 animate-pulse rounded-xl border bg-white" />
      </div>
    </div>
  );
}

export default DashboardPage;
