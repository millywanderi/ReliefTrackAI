import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            ReliefTrack AI
          </h1>
          <p className="text-xs text-slate-500">
            Humanitarian Resource Management
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Notifications"
          >
            🔔
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              U
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-slate-900">
                User
              </p>
              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r bg-white md:block">
          <nav className="space-y-1 p-4">
            <NavItem label="Dashboard" path="/dashboard" />
            <NavItem label="Beneficiaries" path="/beneficiaries" />
            <NavItem label="Warehouses" path="/warehouses" />
            <NavItem label="Inventory" path="/inventory" />
            <NavItem label="Distribution" path="/distribution" />
            <NavItem label="Analytics" path="/analytics" />
            <NavItem label="AI Reports" path="/ai" />

            <div className="my-4 border-t" />

            <NavItem label="Administration" path="/administration" />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  label: string;
  path: string;
}

function NavItem({ label, path }: NavItemProps) {
  return (
    <a
      href={path}
      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
    >
      {label}
    </a>
  );
}

export default AppLayout;
