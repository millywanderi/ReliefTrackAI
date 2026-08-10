import {
  Mail,
  Shield,
  User,
} from "lucide-react";

import { useAuth } from "@/features/auth/AuthContext";

function ProfilePage() {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          View your ReliefTrack AI account information.
        </p>
      </div>

      {/* Profile Header */}
      <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="h-28 bg-slate-900" />

        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-xl font-bold text-slate-700 shadow-sm">
                {initials}
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-semibold text-slate-900">
                  {user?.name ?? "User"}
                </h2>

                <p className="text-sm text-slate-500">
                  ReliefTrack AI user
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Information associated with your account.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ProfileField
            icon={<User size={18} />}
            label="Full Name"
            value={user?.name ?? "Not available"}
          />

          <ProfileField
            icon={<Mail size={18} />}
            label="Email Address"
            value={user?.email ?? "Not available"}
          />

          <ProfileField
            icon={<Shield size={18} />}
            label="Role"
            value={
              user?.role_id === 1
                ? "Administrator"
                : user?.role_id === 2
                  ? "Manager"
                  : user?.role_id === 3
                    ? "Staff"
                    : "User"
            }
          />

          <ProfileField
            icon={<Shield size={18} />}
            label="Account Status"
            value="Active"
          />
        </div>
      </section>

      {/* Security */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Account Security
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Your account is protected using JWT authentication.
        </p>

        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Shield size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Account authenticated
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your session is currently authenticated and protected by
                the ReliefTrack AI authentication system.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function ProfileField({
  icon,
  label,
  value,
}: ProfileFieldProps) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default ProfilePage;
