import {
  Bell,
  Lock,
  Settings,
  Shield,
} from "lucide-react";

function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your ReliefTrack AI application preferences.
        </p>
      </div>

      {/* General Settings */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Settings size={19} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              General Settings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              General application preferences.
            </p>
          </div>
        </div>

        <div className="mt-6 divide-y rounded-xl border">
          <SettingRow
            icon={<Bell size={18} />}
            title="Notifications"
            description="Receive notifications about important operational events."
            enabled
          />

          <SettingRow
            icon={<Shield size={18} />}
            title="Security Alerts"
            description="Receive alerts when security-related events occur."
            enabled
          />
        </div>
      </section>

      {/* Security Settings */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Lock size={19} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Security
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage account security preferences.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <Shield
              size={18}
              className="mt-0.5 text-slate-600"
            />

            <div>
              <p className="text-sm font-semibold text-slate-900">
                JWT Authentication
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                ReliefTrack AI uses JWT tokens to protect authenticated
                sessions and API requests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Settings */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          More Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Additional configuration options will be added as the platform
          develops.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-medium text-slate-700">
              Notification Preferences
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Configure operational notification types.
            </p>
          </div>

          <div className="rounded-xl border border-dashed p-4">
            <p className="text-sm font-medium text-slate-700">
              Display Preferences
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Configure the application interface.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
}

function SettingRow({
  icon,
  title,
  description,
  enabled,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-slate-500">
          {icon}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-900">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div
        className={[
          "relative h-6 w-11 shrink-0 rounded-full",
          enabled ? "bg-slate-900" : "bg-slate-300",
        ].join(" ")}
      >
        <div
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm",
            enabled ? "right-1" : "left-1",
          ].join(" ")}
        />
      </div>
    </div>
  );
}

export default SettingsPage;
