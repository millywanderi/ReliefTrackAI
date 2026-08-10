import { useState } from "react";

import {
  Bell,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  Truck,
  User,
  Users,
  Warehouse,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "@/features/auth/AuthContext";
import { navigationItems } from "./navigation";

const iconMap: Record<string, typeof LayoutDashboard> = {
  "/dashboard": LayoutDashboard,
  "/beneficiaries": Users,
  "/warehouses": Warehouse,
  "/inventory": Package,
  "/distribution": Truck,
  "/analytics": BarChart3,
  "/ai": FileText,
  "/administration": Settings,
};

function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const visibleItems = navigationItems.filter((item) =>
    item.roles.includes(user?.role_id ?? -1),
  );

  const currentItem =
    navigationItems.find((item) => {
      if (item.path === "/dashboard") {
        return location.pathname === "/dashboard";
      }

      return location.pathname.startsWith(item.path);
    }) ?? navigationItems[0];

  const pageTitle =
    location.pathname === "/profile"
      ? "My Profile"
      : location.pathname === "/settings"
        ? "Settings"
        : currentItem?.label ?? "Dashboard";

  const handleLogout = () => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setMobileMenuOpen(false);
    logout();
  };

  const closeMenus = () => {
    setProfileOpen(false);
    setNotificationsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r bg-white",
          "transform transition-transform duration-200 ease-in-out",
          "md:translate-x-0",
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h1 className="text-base font-bold text-slate-900">
                ReliefTrack AI
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Humanitarian Operations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <div className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = iconMap[item.path] ?? ClipboardList;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    closeMenus();
                  }}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                      "text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-900 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-slate-700"
                        }
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {isActive && (
                        <ChevronRight size={15} />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-700">
                <User size={17} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {user?.name ?? "User"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="md:pl-72">
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6">
          {/* Left Side */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <div className="min-w-0">
              {/* Breadcrumbs */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="hidden sm:inline">
                  ReliefTrack AI
                </span>

                <ChevronRight
                  size={13}
                  className="hidden sm:block"
                />

                <span className="truncate font-medium text-slate-600">
                  {pageTitle}
                </span>
              </div>

              <h2 className="mt-1 truncate text-lg font-semibold text-slate-900">
                {pageTitle}
              </h2>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell size={20} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Notifications
                      </h3>

                      <p className="text-xs text-slate-500">
                        Recent system alerts
                      </p>
                    </div>

                    <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-semibold text-red-600">
                      1 new
                    </span>
                  </div>

                  <div className="p-2">
                    <div className="rounded-xl p-3 hover:bg-slate-50">
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                          <Package size={15} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Inventory monitoring
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Stock alerts will appear here when resources require attention.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t px-4 py-3">
                    <button
                      type="button"
                      className="w-full text-center text-xs font-medium text-slate-600 hover:text-slate-900"
                    >
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl p-1.5 pr-2 hover:bg-slate-100"
                aria-label="Open user menu"
                aria-expanded={profileOpen}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? "U"}
                </div>

                <div className="hidden text-left lg:block">
                  <p className="max-w-32 truncate text-sm font-medium text-slate-900">
                    {user?.name ?? "User"}
                  </p>

                  <p className="text-[11px] text-slate-500">
                    Administrator
                  </p>
                </div>

                <ChevronDown
                  size={16}
                  className="hidden text-slate-400 sm:block"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border bg-white shadow-xl">
                  {/* User Information */}
                  <div className="border-b px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {user?.name ?? "User"}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {user?.email ?? ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Navigation */}
                  <div className="p-2">
                    <NavLink
                      to="/profile"
                      onClick={closeMenus}
                      className={({ isActive }) =>
                        [
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        ].join(" ")
                      }
                    >
                      <User size={17} />
                      My Profile
                    </NavLink>

                    <NavLink
                      to="/settings"
                      onClick={closeMenus}
                      className={({ isActive }) =>
                        [
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                          isActive
                            ? "bg-slate-100 font-medium text-slate-900"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        ].join(" ")
                      }
                    >
                      <Settings size={17} />
                      Settings
                    </NavLink>
                  </div>

                  {/* Logout */}
                  <div className="border-t p-2">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
