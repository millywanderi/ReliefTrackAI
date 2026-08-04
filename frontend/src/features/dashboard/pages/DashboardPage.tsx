function DashboardPage() {
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
          value="—"
          description="Registered beneficiaries"
        />

        <StatCard
          title="Warehouses"
          value="—"
          description="Active warehouses"
        />

        <StatCard
          title="Resources"
          value="—"
          description="Tracked resources"
        />

        <StatCard
          title="Distributions"
          value="—"
          description="Distribution events"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Recent Activity
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Recent humanitarian operations will appear here.
          </p>
        </section>

        <section className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            AI Insights
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            AI-generated operational insights will appear here.
          </p>
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

function StatCard({ title, value, description }: StatCardProps) {
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

export default DashboardPage;
